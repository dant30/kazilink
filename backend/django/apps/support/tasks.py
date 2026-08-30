from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from .models import SupportTicket


@shared_task
def close_resolved_tickets(days=30):
	cutoff = timezone.now() - timedelta(days=days)
	return SupportTicket.objects.filter(
		status=SupportTicket.Status.RESOLVED,
		updated_at__lt=cutoff,
	).update(status=SupportTicket.Status.CLOSED)
