from django.db import models


class JobApplication(models.Model):
	class Status(models.TextChoices):
		APPLIED = 'applied', 'Applied'
		SHORTLISTED = 'shortlisted', 'Shortlisted'
		INTERVIEW_SCHEDULED = 'interview_scheduled', 'Interview scheduled'
		HIRED = 'hired', 'Hired'
		REJECTED = 'rejected', 'Rejected'

	job = models.ForeignKey('jobs.Job', on_delete=models.CASCADE, related_name='applications')
	worker = models.ForeignKey('accounts.WorkerProfile', on_delete=models.CASCADE, related_name='applications')
	cover_note = models.TextField(blank=True)
	applied_date = models.DateTimeField(auto_now_add=True)
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.APPLIED)
	reviewed_by_employer = models.BooleanField(default=False)
	interview_date = models.DateTimeField(null=True, blank=True)
	interview_note = models.TextField(blank=True)

	class Meta:
		constraints = [models.UniqueConstraint(fields=['job', 'worker'], name='unique_job_worker_application')]

	def __str__(self):
		return f'{self.worker} - {self.job}'



