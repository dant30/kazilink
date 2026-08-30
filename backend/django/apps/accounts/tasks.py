from celery import shared_task
from django.utils import timezone

from .models import PhoneVerification


@shared_task
def delete_expired_phone_verifications():
	deleted, _ = PhoneVerification.objects.filter(
		expires_at__lt=timezone.now(), verified_at__isnull=True
	).delete()
	return deleted
