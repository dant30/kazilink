from celery import shared_task

from .models import JobApplication


@shared_task
def reject_applications_for_filled_jobs():
	applications = JobApplication.objects.filter(
		job__status='filled',
	).exclude(status__in=['hired', 'rejected'])
	updated = applications.update(status='rejected', reviewed_by_employer=True)
	return updated
