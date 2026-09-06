from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.search import SearchVectorField
from django.db import models


class Job(models.Model):
	class JobType(models.TextChoices):
		WEEKEND_GIG = 'weekend_gig', 'Weekend gig'
		FULL_TIME = 'full_time', 'Full time'
		PART_TIME = 'part_time', 'Part time'
		DAILY_SHIFT = 'daily_shift', 'Daily shift'
		SHIFT_24HR = 'shift_24hr', '24-hour shift'

	class Status(models.TextChoices):
		OPEN = 'open', 'Open'
		CLOSED = 'closed', 'Closed'
		FILLED = 'filled', 'Filled'

	employer = models.ForeignKey('accounts.EmployerProfile', on_delete=models.CASCADE, related_name='jobs')
	establishment = models.ForeignKey('establishments.Establishment', on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs')
	title = models.CharField(max_length=255)
	category = models.CharField(max_length=100)
	location = models.CharField(max_length=100)
	job_type = models.CharField(max_length=20, choices=JobType.choices)
	pay_amount_ksh = models.PositiveIntegerField()
	pay_period = models.CharField(max_length=20)
	shift_times = models.CharField(max_length=255, blank=True)
	description = models.TextField()
	search_document = SearchVectorField(null=True, editable=False)
	requirements = ArrayField(models.TextField(), blank=True, default=list)
	benefits = ArrayField(models.TextField(), blank=True, default=list)
	required_skills = ArrayField(models.CharField(max_length=100), blank=True, default=list)
	minimum_experience_years = models.PositiveIntegerField(default=0)
	is_urgent = models.BooleanField(default=False)
	is_featured = models.BooleanField(default=False)
	featured_until = models.DateTimeField(null=True, blank=True)
	boost_until = models.DateTimeField(null=True, blank=True)
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
	applicant_count = models.PositiveIntegerField(default=0)
	posted_date = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.title


class SavedJob(models.Model):
	worker = models.ForeignKey('accounts.WorkerProfile', on_delete=models.CASCADE, related_name='saved_jobs')
	job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by_workers')
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		constraints = [models.UniqueConstraint(fields=('worker', 'job'), name='jobs_saved_job_worker_job_unique')]
		ordering = ('-created_at',)



