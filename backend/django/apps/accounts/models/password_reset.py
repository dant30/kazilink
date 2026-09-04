from django.db import models
from django.utils import timezone


class PasswordResetVerification(models.Model):
	user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='password_reset_verifications')
	code_hash = models.CharField(max_length=128)
	expires_at = models.DateTimeField()
	attempts = models.PositiveIntegerField(default=0)
	verified_at = models.DateTimeField(null=True, blank=True)
	reset_token_hash = models.CharField(max_length=128, blank=True)
	reset_token_expires_at = models.DateTimeField(null=True, blank=True)
	created_at = models.DateTimeField(default=timezone.now)

	@property
	def is_expired(self):
		return timezone.now() >= self.expires_at

	@property
	def reset_token_is_valid(self):
		return bool(self.verified_at and self.reset_token_expires_at and timezone.now() < self.reset_token_expires_at)
