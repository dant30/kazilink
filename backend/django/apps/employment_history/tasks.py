from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from .models import EmploymentRecord


@shared_task
def flag_stale_verification_records(days=14):
	cutoff = timezone.now() - timedelta(days=days)
	return EmploymentRecord.objects.filter(
		verification_status=EmploymentRecord.VerificationStatus.PENDING,
		worker__user__joined_date__lte=cutoff,
	).count()
