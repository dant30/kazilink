from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from .models import CreditRecharge


@shared_task
def mark_stale_recharges_failed(hours=24):
	cutoff = timezone.now() - timedelta(hours=hours)
	return CreditRecharge.objects.filter(
		status=CreditRecharge.Status.PENDING,
		created_at__lt=cutoff,
	).update(status=CreditRecharge.Status.FAILED)
