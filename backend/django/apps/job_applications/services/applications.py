from django.db import transaction

from apps.credits.services import spend_credits

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