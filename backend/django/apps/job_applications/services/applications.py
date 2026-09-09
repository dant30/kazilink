from django.db import transaction
from django.utils import timezone

from apps.credits.services import spend_credits
from apps.employment_history.models import EmploymentRecord

from ..models import JobApplication


ALLOWED_TRANSITIONS = {
    JobApplication.Status.APPLIED: {JobApplication.Status.SHORTLISTED, JobApplication.Status.REJECTED},
    JobApplication.Status.SHORTLISTED: {
        JobApplication.Status.INTERVIEW_SCHEDULED,
        JobApplication.Status.HIRED,
        JobApplication.Status.REJECTED,
    },
    JobApplication.Status.INTERVIEW_SCHEDULED: {
        JobApplication.Status.HIRED,
        JobApplication.Status.REJECTED,
    },
    JobApplication.Status.HIRED: set(),
    JobApplication.Status.REJECTED: set(),
}


@transaction.atomic
def create_application(*, worker, job, cover_note=''):
    if not worker.user.is_worker:
        raise PermissionError('Only worker accounts can apply for jobs.')
    if job.status != job.Status.OPEN:
        raise ValueError('Applications are only accepted for open jobs.')
    if JobApplication.objects.filter(job=job, worker=worker).exists():
        raise ValueError('You have already applied for this job.')
    application = JobApplication.objects.create(job=job, worker=worker, cover_note=cover_note)
    spend_credits(
        user=worker.user,
        action='application',
        reference=f'job:{job.id}',
        idempotency_key=f'application:{application.id}',
        metadata={'application_id': application.id, 'job_id': job.id},
    )
    return application


@transaction.atomic
def update_application_status(*, application, status, interview_date=None, interview_note=''):
    application = JobApplication.objects.select_for_update().select_related('job').get(pk=application.pk)
    if status == application.status:
        raise ValueError('The application already has this status.')
    if status not in ALLOWED_TRANSITIONS.get(application.status, set()):
        raise ValueError(f'Cannot change application status from {application.status} to {status}.')
    if status == JobApplication.Status.HIRED and application.job.status == application.job.Status.FILLED:
        raise ValueError('This job has already been filled.')
    application.status = status
    application.reviewed_by_employer = True
    application.interview_date = interview_date
    application.interview_note = interview_note
    application.save(update_fields=['status', 'reviewed_by_employer', 'interview_date', 'interview_note'])
    if status == JobApplication.Status.HIRED:
        application.job.status = application.job.Status.FILLED
        application.job.save(update_fields=['status'])
    return application


@transaction.atomic
def update_engagement(*, application, engagement_status, engagement_note=''):
    locked_application = JobApplication.objects.select_for_update().get(pk=application.pk)
    application = JobApplication.objects.select_related('job__employer', 'job__establishment', 'worker').get(pk=locked_application.pk)
    if application.status != JobApplication.Status.HIRED:
        raise ValueError('Only hired applications can have an engagement outcome.')
    if application.engagement_status != JobApplication.EngagementStatus.ACTIVE:
        raise ValueError('This engagement has already been closed.')
    if engagement_status == JobApplication.EngagementStatus.ACTIVE:
        raise ValueError('Choose a closing outcome.')
    application.engagement_status = engagement_status
    application.engagement_ended_at = timezone.now()
    application.engagement_note = engagement_note
    application.save(update_fields=['engagement_status', 'engagement_ended_at', 'engagement_note'])
    EmploymentRecord.objects.update_or_create(
        worker=application.worker,
        employer=application.job.employer,
        establishment=application.job.establishment,
        establishment_name=application.job.establishment.name if application.job.establishment else application.job.employer.business_name,
        position=application.job.title,
        defaults={
            'establishment_type': application.job.establishment.establishment_type if application.job.establishment else '',
            'location': application.job.location,
            'start_date': application.applied_date.date(),
            'end_date': application.engagement_ended_at.date(),
            'is_current': False,
            'responsibilities': [],
            'reference_contact_name': application.job.employer.contact_person,
            'reference_contact_phone': application.job.employer.user.phone,
            'reference_role': 'Employer',
            'verification_status': EmploymentRecord.VerificationStatus.PENDING,
            'reference_verification_status': EmploymentRecord.ReferenceVerificationStatus.PENDING,
            'verification_notes': engagement_note,
        },
    )
    return application