from django.conf import settings
from django.db import models


class SupportTicket(models.Model):
	class Status(models.TextChoices):
		OPEN = 'open', 'Open'
		IN_PROGRESS = 'in_progress', 'In progress'
		RESOLVED = 'resolved', 'Resolved'
		CLOSED = 'closed', 'Closed'

	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='support_tickets')
	subject = models.CharField(max_length=255)
	description = models.TextField()
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
	assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_support_tickets')
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['-updated_at', '-created_at']
		indexes = [
			models.Index(fields=['user', 'status', '-updated_at']),
			models.Index(fields=['status', '-updated_at']),
		]

	def __str__(self):
		return f'#{self.pk} {self.subject}'



