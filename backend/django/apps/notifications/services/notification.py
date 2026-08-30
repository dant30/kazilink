from django.db import transaction

from ..models import Notification, NotificationPreference


def notifications_for_user(user):
	return Notification.objects.filter(user=user)


@transaction.atomic
def create_notification(*, user, title, message, notification_type, link_tab=''):
	return Notification.objects.create(
		user=user,
		title=title.strip(),
		message=message.strip(),
		notification_type=notification_type,
		link_tab=link_tab,
	)


def mark_notification_read(*, notification):
	if not notification.is_read:
		notification.is_read = True
		notification.save(update_fields=('is_read',))
	return notification


def get_or_create_preferences(*, user):
	preferences, _ = NotificationPreference.objects.get_or_create(user=user)
	return preferences# Email, SMS, Push
