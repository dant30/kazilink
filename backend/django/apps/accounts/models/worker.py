from django.contrib.postgres.fields import ArrayField
from django.core.validators import MaxValueValidator
from django.db import models


class WorkerProfile(models.Model):
	class Availability(models.TextChoices):
		IMMEDIATE = 'immediate', 'Immediate'
		NIGHT_SHIFTS = 'night_shifts', 'Night shifts'
		FULL_TIME = 'full_time', 'Full time'
		PART_TIME = 'part_time', 'Part time'

	user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='worker_profile')
	primary_role = models.CharField(max_length=100)
	secondary_roles = ArrayField(models.CharField(max_length=100), blank=True, default=list)
	location = models.CharField(max_length=100)
	years_of_experience = models.PositiveIntegerField(default=0)
	expected_daily_rate_ksh = models.PositiveIntegerField()
	expected_monthly_salary_ksh = models.PositiveIntegerField(null=True, blank=True)
	availability = models.CharField(max_length=20, choices=Availability.choices)
	bio = models.TextField()
	skills = ArrayField(models.CharField(max_length=100), blank=True, default=list)
	languages = ArrayField(models.CharField(max_length=50), blank=True, default=list)
	avatar = models.FileField(upload_to='avatars/workers/', blank=True, null=True)
	rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
	reviews_count = models.PositiveIntegerField(default=0)
	jobs_completed = models.PositiveIntegerField(default=0)
	punctuality_score = models.PositiveIntegerField(default=0, validators=[MaxValueValidator(100)])
	response_time_minutes = models.PositiveIntegerField(default=0)
	is_reference_checked = models.BooleanField(default=False)
	consent_history_sharing = models.BooleanField(default=False)
	national_id_masked = models.CharField(max_length=20, blank=True)
	last_employer = models.CharField(max_length=255, blank=True, null=True)
	background_check_verified = models.BooleanField(default=False)
	open_to_work = models.BooleanField(default=True)

	def __str__(self):
		return f'{self.user.full_name} - {self.primary_role}'
# Worker model
