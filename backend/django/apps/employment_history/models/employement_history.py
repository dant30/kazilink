from django.db import models


class EmploymentRecord(models.Model):
	class VerificationStatus(models.TextChoices):
		PENDING = 'pending', 'Pending'
		VERIFIED = 'verified', 'Verified'
		REJECTED = 'rejected', 'Rejected'

	worker = models.ForeignKey('accounts.WorkerProfile', on_delete=models.CASCADE, related_name='employment_history')
	establishment_name = models.CharField(max_length=255)
	establishment_type = models.CharField(max_length=100, blank=True)
	location = models.CharField(max_length=100, blank=True)
	position = models.CharField(max_length=100)
	start_date = models.DateField()
	end_date = models.DateField(null=True, blank=True)
	is_current = models.BooleanField(default=False)
	responsibilities = models.JSONField(default=list, blank=True)
	reference_contact_name = models.CharField(max_length=255)
	reference_contact_phone = models.CharField(max_length=15)
	reference_role = models.CharField(max_length=100, blank=True)
	verification_status = models.CharField(max_length=20, choices=VerificationStatus.choices, default=VerificationStatus.PENDING)
	verified_at = models.DateTimeField(null=True, blank=True)
	verified_by = models.CharField(max_length=255, blank=True)
	verification_notes = models.TextField(blank=True)

	def __str__(self):
		return f'{self.worker.user.full_name} - {self.establishment_name}'


class HistoryAccessLog(models.Model):
	employer = models.ForeignKey('accounts.EmployerProfile', on_delete=models.CASCADE, related_name='history_access_logs')
	worker = models.ForeignKey('accounts.WorkerProfile', on_delete=models.CASCADE, related_name='history_access_logs')
	unlocked_at = models.DateTimeField(auto_now_add=True)
	transaction = models.ForeignKey('payments.Transaction', on_delete=models.SET_NULL, null=True, blank=True, related_name='history_unlocks')

	class Meta:
		constraints = [models.UniqueConstraint(fields=['employer', 'worker'], name='unique_history_access_per_employer_worker')]



