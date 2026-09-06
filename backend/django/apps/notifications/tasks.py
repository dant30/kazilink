from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from apps.accounts.models import User

from .models import Notification
from .services import create_notification


@shared_task
def delete_old_read_notifications(days=180):
	cutoff = timezone.now() - timedelta(days=days)
	return Notification.objects.filter(is_read=True, timestamp__lt=cutoff).delete()[0]


def missing_profile_details(user):
	if user.is_worker and hasattr(user, 'worker_profile'):
		profile = user.worker_profile
		return not all((profile.primary_role, profile.location, profile.availability, profile.bio, profile.skills, profile.languages, profile.expected_daily_rate_ksh))
	if user.is_employer and hasattr(user, 'employer_profile'):
		profile = user.employer_profile
		return not all((profile.business_name, profile.location, profile.business_type, profile.contact_person))
	return False


@shared_task
def remind_incomplete_profiles():
	today = timezone.localdate()
	users = User.objects.filter(is_active=True).filter(is_worker=True) | User.objects.filter(is_active=True, is_employer=True)
	users = users.select_related('worker_profile', 'employer_profile').distinct()
	created = 0
	for user in users.iterator():
		if not missing_profile_details(user):
			continue
		if Notification.objects.filter(user=user, notification_type='profile_reminder', timestamp__date=today).exists():
			continue
		create_notification(
			user=user,
			title='Complete your KaziLink profile',
			message='Add your key profile details so KaziLink can improve your matches and verification readiness.',
			notification_type='profile_reminder',
			link_tab='profile',
		)
		created += 1
	return created
