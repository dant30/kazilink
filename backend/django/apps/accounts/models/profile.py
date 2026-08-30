from django.db import models


class Profile(models.Model):
	user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='profile')
	avatar = models.URLField(blank=True, null=True)
	bio = models.TextField(blank=True)
	location = models.CharField(max_length=100, blank=True)

	def __str__(self):
		return f'{self.user.full_name} profile'


