from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from .models import FraudAlert


@shared_task
def escalate_stale_alerts(hours=72):
	cutoff = timezone.now() - timedelta(hours=hours)
	return FraudAlert.objects.filter(
		status=FraudAlert.Status.PENDING,
		severity=FraudAlert.Severity.MEDIUM,
		detected_at__lt=cutoff,
	).update(severity=FraudAlert.Severity.HIGH)
