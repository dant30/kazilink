from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from .models import Job
from .signals import sync_applicant_count


@shared_task
def synchronize_applicant_counts():
	for job_id in Job.objects.values_list('id', flat=True).iterator():
		sync_applicant_count(job_id)
	return Job.objects.count()


@shared_task
def close_expired_jobs():
	cutoff = timezone.now() - timedelta(days=30)
	return Job.objects.filter(status=Job.Status.OPEN, posted_date__lt=cutoff).update(status=Job.Status.CLOSED)
