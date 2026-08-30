from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from .models import Transaction


@shared_task
def mark_stale_transactions_failed(hours=24):
	cutoff = timezone.now() - timedelta(hours=hours)
	return Transaction.objects.filter(status=Transaction.Status.PENDING, created_at__lt=cutoff).update(status=Transaction.Status.FAILED)
