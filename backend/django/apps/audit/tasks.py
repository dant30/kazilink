from datetime import timedelta

from celery import shared_task
from django.conf import settings
from django.utils import timezone

from .models import AuditLog


@shared_task
def purge_old_audit_logs(days=None):
	retention_days = days or getattr(settings, 'AUDIT_LOG_RETENTION_DAYS', 365)
	cutoff = timezone.now() - timedelta(days=retention_days)
	return AuditLog.objects.filter(created_at__lt=cutoff).delete()[0]
