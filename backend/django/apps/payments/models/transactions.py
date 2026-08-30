from django.db import models
from django.utils import timezone


class Transaction(models.Model):
	class Status(models.TextChoices):
		PENDING = 'pending', 'Pending'
		COMPLETED = 'completed', 'Completed'
		FAILED = 'failed', 'Failed'
		REFUNDED = 'refunded', 'Refunded'

	class TransactionType(models.TextChoices):
		HISTORY_UNLOCK = 'history_unlock', 'History unlock'
		BUNDLE = 'bundle', 'Profile unlock bundle'
		FEATURED_JOB = 'featured_job', 'Featured job'
		SUBSCRIPTION = 'subscription', 'Subscription'

	employer = models.ForeignKey('accounts.EmployerProfile', on_delete=models.PROTECT, related_name='transactions')
	transaction_type = models.CharField(max_length=30, choices=TransactionType.choices)
	amount_ksh = models.PositiveIntegerField()
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
	provider = models.CharField(max_length=30, default='mpesa')
	provider_reference = models.CharField(max_length=100, blank=True)
	metadata = models.JSONField(default=dict, blank=True)
	created_at = models.DateTimeField(default=timezone.now)
	completed_at = models.DateTimeField(null=True, blank=True)

	def __str__(self):
		return f'{self.employer} - KSh {self.amount_ksh} ({self.status})'



