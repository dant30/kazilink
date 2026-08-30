from django.db import models


class UserRole(models.Model):
	class Role(models.TextChoices):
		WORKER = 'worker', 'Worker'
		EMPLOYER = 'employer', 'Employer'
		ADMIN = 'admin', 'Admin'

	user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='roles')
	role = models.CharField(max_length=20, choices=Role.choices)

	class Meta:
		constraints = [models.UniqueConstraint(fields=['user', 'role'], name='unique_user_role')]
# Role model
