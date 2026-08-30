from django.db import models


class Subscription(models.Model):
	class Status(models.TextChoices):
		ACTIVE = 'active', 'Active'
		EXPIRED = 'expired', 'Expired'
		CANCELLED = 'cancelled', 'Cancelled'

	employer = models.ForeignKey('accounts.EmployerProfile', on_delete=models.CASCADE, related_name='subscriptions')
	plan = models.CharField(max_length=20)
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
	started_at = models.DateTimeField(auto_now_add=True)
	expires_at = models.DateTimeField()
	auto_renew = models.BooleanField(default=True)
	provider_reference = models.CharField(max_length=100, blank=True)

	def __str__(self):
		return f'{self.employer} - {self.plan}'



