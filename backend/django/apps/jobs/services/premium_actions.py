from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from apps.credits.services import spend_credits

from ..models import Job


@transaction.atomic
def feature_job_with_credits(*, employer, job, idempotency_key):
	if job.employer_id != employer.id:
		raise PermissionError('You can only feature your own jobs.')
	if job.status != Job.Status.OPEN:
		raise ValueError('Only open jobs can be featured.')
	entry = spend_credits(
		user=employer.user,
		action='featured_job_24h',
		reference=f'job:{job.id}',
		idempotency_key=idempotency_key,
		metadata={'job_id': job.id, 'duration_hours': 24},
	)
	job.is_featured = True
	job.featured_until = timezone.now() + timedelta(hours=24)
	job.save(update_fields=('is_featured', 'featured_until'))
	return job, entry


@transaction.atomic
def boost_job_with_credits(*, employer, job, idempotency_key):
	if job.employer_id != employer.id:
		raise PermissionError('You can only boost your own jobs.')
	if job.status != Job.Status.OPEN:
		raise ValueError('Only open jobs can be boosted.')
	entry = spend_credits(
		user=employer.user,
		action='job_boost_7d',
		reference=f'job:{job.id}',
		idempotency_key=idempotency_key,
		metadata={'job_id': job.id, 'duration_days': 7},
	)
	job.boost_until = timezone.now() + timedelta(days=7)
	job.save(update_fields=('boost_until',))
	return job, entry