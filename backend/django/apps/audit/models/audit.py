from django.conf import settings
from django.db import models
from django.utils import timezone


class AuditLog(models.Model):
	actor = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
		related_name='audit_events',
	)
	action = models.CharField(max_length=100)
	target_type = models.CharField(max_length=100)
	target_id = models.CharField(max_length=100)
	metadata = models.JSONField(default=dict, blank=True)
	created_at = models.DateTimeField(default=timezone.now)

	class Meta:
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=['action', '-created_at'], name='audit_action_created_idx'),
			models.Index(fields=['target_type', 'target_id', '-created_at'], name='audit_target_created_idx'),
		]

	def __str__(self):
		return f'{self.action} - {self.target_type}:{self.target_id}'


