from django.db import models


class EmployerProfile(models.Model):
	class SubscriptionPlan(models.TextChoices):
		FREE = 'free', 'Free'
		GROWTH = 'growth', 'Growth'
		PRO_ENTERPRISE = 'pro_enterprise', 'Pro Enterprise'

	user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='employer_profile')
	business_name = models.CharField(max_length=255, blank=True)
	location = models.CharField(max_length=100, blank=True)
	business_type = models.CharField(max_length=100, blank=True)
	establishment = models.ForeignKey(
		'establishments.Establishment', on_delete=models.SET_NULL, null=True, blank=True, related_name='employer_profiles'
	)
	establishments = models.ManyToManyField(
		'establishments.Establishment', related_name='employers', blank=True
	)
	contact_person = models.CharField(max_length=255)
	avatar = models.FileField(upload_to='avatars/employers/', blank=True, null=True)
	active_jobs_count = models.PositiveIntegerField(default=0)
	total_hires = models.PositiveIntegerField(default=0)
	average_response_time_minutes = models.PositiveIntegerField(default=0)
	auto_shortlist = models.BooleanField(default=True)
	verified_only = models.BooleanField(default=True)
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
