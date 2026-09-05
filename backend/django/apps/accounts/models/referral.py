from django.conf import settings
from django.db import models
from django.utils import timezone


class ReferralCode(models.Model):
	owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='referral_code_record')
	code = models.CharField(max_length=20, unique=True)
	created_at = models.DateTimeField(default=timezone.now)

	def __str__(self):
		return f'{self.owner} - {self.code}'


class Referral(models.Model):
	class Status(models.TextChoices):
		PENDING = 'pending', 'Pending'
		REWARDED = 'rewarded', 'Rewarded'
		REJECTED = 'rejected', 'Rejected'

	referrer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='referrals_made')
	referred = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='referral_record')
	code = models.ForeignKey(ReferralCode, on_delete=models.PROTECT, related_name='referrals')
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
	referrer_reward = models.PositiveIntegerField(default=5)
	referred_reward = models.PositiveIntegerField(default=2)
	created_at = models.DateTimeField(default=timezone.now)
	rewarded_at = models.DateTimeField(null=True, blank=True)
	metadata = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ('-created_at', '-id')

	def __str__(self):
		return f'{self.referrer} referred {self.referred} ({self.status})'
