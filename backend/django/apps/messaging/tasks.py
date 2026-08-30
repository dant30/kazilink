from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from .models import Conversation


@shared_task
def delete_empty_stale_conversations(days=90):
	cutoff = timezone.now() - timedelta(days=days)
	return Conversation.objects.filter(messages__isnull=True, last_timestamp__lt=cutoff).delete()[0]
