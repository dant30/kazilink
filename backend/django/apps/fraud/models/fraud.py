from django.db import models


class FraudAlert(models.Model):
	class Severity(models.TextChoices):
		LOW = 'low', 'Low'
		MEDIUM = 'medium', 'Medium'
		HIGH = 'high', 'High'

	class Status(models.TextChoices):
		PENDING = 'pending', 'Pending'
		RESOLVED = 'resolved', 'Resolved'
		DISMISSED = 'dismissed', 'Dismissed'

	target_type = models.CharField(max_length=20)
	target_id = models.CharField(max_length=50)
	target_name = models.CharField(max_length=255)
	reason = models.CharField(max_length=255)
	severity = models.CharField(max_length=20, choices=Severity.choices)
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
	detected_at = models.DateTimeField(auto_now_add=True)
	details = models.TextField()
	resolved_at = models.DateTimeField(null=True, blank=True)
	resolved_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_fraud_alerts')

	def __str__(self):
		return f'{self.target_name} - {self.reason} ({self.severity})'



