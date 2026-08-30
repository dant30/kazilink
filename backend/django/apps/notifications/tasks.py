from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from .models import Notification


@shared_task
def delete_old_read_notifications(days=180):
	cutoff = timezone.now() - timedelta(days=days)
	return Notification.objects.filter(is_read=True, timestamp__lt=cutoff).delete()[0]
