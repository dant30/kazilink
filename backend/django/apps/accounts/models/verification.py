from django.db import models
from django.utils import timezone


class PhoneVerification(models.Model):
	user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='phone_verifications')
	code_hash = models.CharField(max_length=128)
	expires_at = models.DateTimeField()
	verified_at = models.DateTimeField(null=True, blank=True)
	attempts = models.PositiveIntegerField(default=0)
	created_at = models.DateTimeField(default=timezone.now)

	@property
	def is_expired(self):
		return timezone.now() >= self.expires_at


class BusinessVerification(models.Model):
	class Status(models.TextChoices):
		PENDING = 'pending', 'Pending'
		VERIFIED = 'verified', 'Verified'
		REJECTED = 'rejected', 'Rejected'

	employer = models.ForeignKey('accounts.EmployerProfile', on_delete=models.CASCADE, related_name='business_verifications')
	document = models.FileField(upload_to='business-verification/')
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
	notes = models.TextField(blank=True)
	reviewed_at = models.DateTimeField(null=True, blank=True)
	reviewed_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='business_verifications_reviewed')
# Verification
