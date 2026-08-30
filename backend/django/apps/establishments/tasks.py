from celery import shared_task

from .models import Establishment
from .signals import sync_verification


@shared_task
def synchronize_establishment_verification():
	for establishment_id in Establishment.objects.values_list('id', flat=True).iterator():
		sync_verification(establishment_id)
	return Establishment.objects.count()
