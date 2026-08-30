from django.db import models


class Establishment(models.Model):
	employer = models.ForeignKey(
		'accounts.EmployerProfile', on_delete=models.SET_NULL, null=True, blank=True,
		related_name='owned_establishments'
	)
	name = models.CharField(max_length=255)
	establishment_type = models.CharField(max_length=100)
	location = models.CharField(max_length=100)
	address = models.TextField()
	logo = models.URLField(blank=True, null=True)
	is_verified = models.BooleanField(default=False)

	def __str__(self):
		return self.name



