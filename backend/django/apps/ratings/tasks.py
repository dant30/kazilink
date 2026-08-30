from celery import shared_task

from apps.accounts.models import WorkerProfile

from .services import recalculate_worker_rating


@shared_task
def recalculate_all_worker_ratings():
	for worker_id in WorkerProfile.objects.values_list('id', flat=True).iterator():
		recalculate_worker_rating(worker_id)
	return WorkerProfile.objects.count()
