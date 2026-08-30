from django.conf import settings
from django.db import models


class Notification(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
	title = models.CharField(max_length=255)
	message = models.TextField()
	notification_type = models.CharField(max_length=50)
	timestamp = models.DateTimeField(auto_now_add=True)
	is_read = models.BooleanField(default=False)
	link_tab = models.CharField(max_length=50, blank=True)

	class Meta:
		ordering = ['-timestamp']
		indexes = [
			models.Index(fields=['user', 'is_read', '-timestamp']),
		]

	def __str__(self):
		return f'{self.title} ({self.user})'

class NotificationPreference(models.Model):
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='notification_preferences',
	)
	email_enabled = models.BooleanField(default=True)
	sms_enabled = models.BooleanField(default=True)
	push_enabled = models.BooleanField(default=True)

	def __str__(self):
		return f'{self.user} notification preferences'


__all__ = ['Notification', 'NotificationPreference']
