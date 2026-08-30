from django.db import transaction

from apps.job_applications.models import JobApplication

from ..models import Review


@transaction.atomic
def create_review(*, author, validated_data):
    target_worker = validated_data['target_worker']
    job = validated_data['job']
    application = JobApplication.objects.filter(
        job=job,
        worker=target_worker,
        job__employer=author,
        status=JobApplication.Status.HIRED,
    ).first()
    if application is None:
        raise PermissionError('Reviews are only available after a completed platform hire.')
    if Review.objects.filter(author=author, target_worker=target_worker, job=job).exists():
        raise ValueError('A review has already been submitted for this hire.')
    establishment = job.establishment
    return Review.objects.create(
        author=author,
        target_worker=target_worker,
        job=job,
        author_name=author.user.full_name,
        author_role=author.contact_person,
        author_avatar=author.user.profile.avatar if hasattr(author.user, 'profile') else None,
        establishment_name=establishment.name if establishment else '',
        is_verified_hire=True,
        **{key: value for key, value in validated_data.items() if key not in {'target_worker', 'job'}},
    )


@transaction.atomic
def update_review(*, review, validated_data):
    for field, value in validated_data.items():
        setattr(review, field, value)
    review.save(update_fields=list(validated_data))
    return review


def recalculate_worker_rating(worker_id):
    from django.db.models import Avg, Count
    from apps.accounts.models import WorkerProfile

    aggregate = Review.objects.filter(target_worker_id=worker_id).aggregate(
        average=Avg('rating'), count=Count('id')
    )
    WorkerProfile.objects.filter(pk=worker_id).update(
        rating=aggregate['average'] or 0,
        reviews_count=aggregate['count'],
    )
