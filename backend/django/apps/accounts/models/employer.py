from django.db import models


class EmployerProfile(models.Model):
	class SubscriptionPlan(models.TextChoices):
		FREE = 'free', 'Free'
		GROWTH = 'growth', 'Growth'
		PRO_ENTERPRISE = 'pro_enterprise', 'Pro Enterprise'

	user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='employer_profile')
	establishment = models.ForeignKey(
		'establishments.Establishment', on_delete=models.SET_NULL, null=True, blank=True, related_name='employer_profiles'
	)
	contact_person = models.CharField(max_length=255)
	active_jobs_count = models.PositiveIntegerField(default=0)
	total_hires = models.PositiveIntegerField(default=0)
	history_unlock_credits = models.PositiveIntegerField(default=0)
	unlocked_workers = models.ManyToManyField(
		'accounts.WorkerProfile', through='employment_history.HistoryAccessLog', blank=True
	)
	subscription_plan = models.CharField(max_length=20, choices=SubscriptionPlan.choices, default=SubscriptionPlan.FREE)
	subscription_expires_at = models.DateTimeField(null=True, blank=True)
	verified_business = models.BooleanField(default=False)

	def __str__(self):
		return f'{self.user.full_name} - employer'
# Employer model
