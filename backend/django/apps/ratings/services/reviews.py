from django.db import transaction

from apps.job_applications.models import JobApplication

from ..models import Review


@transaction.atomic
def create_review(*, author=None, author_worker=None, validated_data):
    job = validated_data['job']
    target_worker = validated_data.get('target_worker')
    target_employer = validated_data.get('target_employer')

    if author is not None:
        if target_worker is None or target_employer is not None:
            raise ValueError('Employers must select a worker to review.')
        application = JobApplication.objects.filter(job=job, worker=target_worker, job__employer=author, status=JobApplication.Status.HIRED).exclude(engagement_status=JobApplication.EngagementStatus.ACTIVE).first()
        duplicate = Review.objects.filter(author=author, target_worker=target_worker, job=job).exists()
        author_fields = {'author': author, 'target_worker': target_worker}
        author_name = author.user.full_name
        author_role = author.contact_person
    else:
        if author_worker is None or target_employer is None or target_worker is not None:
            raise ValueError('Workers must select an employer to review.')
        application = JobApplication.objects.filter(job=job, worker=author_worker, job__employer=target_employer, status=JobApplication.Status.HIRED).exclude(engagement_status=JobApplication.EngagementStatus.ACTIVE).first()
        duplicate = Review.objects.filter(author_worker=author_worker, target_employer=target_employer, job=job).exists()
        author_fields = {'author_worker': author_worker, 'target_employer': target_employer}
        author_name = author_worker.user.full_name
        author_role = author_worker.primary_role

    if application is None:
        raise PermissionError('Reviews are only available after a completed platform hire.')
    if duplicate:
        raise ValueError('A review has already been submitted for this hire.')
    establishment = job.establishment
    return Review.objects.create(
        **author_fields,
        job=job,
        author_name=author_name,
        author_role=author_role,
        establishment_name=establishment.name if establishment else '',
        is_verified_hire=True,
        role_performed=validated_data.get('role_performed') or job.title,
        **{key: value for key, value in validated_data.items() if key not in {'target_worker', 'target_employer', 'job', 'role_performed'}},
    )


@transaction.atomic
def update_review(*, review, validated_data):
    for field, value in validated_data.items():
        setattr(review, field, value)
    review.save(update_fields=list(validated_data))
    return review


def recalculate_worker_rating(worker_id):
    if not worker_id:
        return
    from django.db.models import Avg, Count
    from apps.accounts.models import WorkerProfile

    aggregate = Review.objects.filter(target_worker_id=worker_id).aggregate(
        average=Avg('rating'), count=Count('id')
    )
    WorkerProfile.objects.filter(pk=worker_id).update(
        rating=aggregate['average'] or 0,
        reviews_count=aggregate['count'],
    )
