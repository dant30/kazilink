from django.db import models


class Establishment(models.Model):
	name = models.CharField(max_length=255)
	establishment_type = models.CharField(max_length=100)
	location = models.CharField(max_length=100)
	address = models.TextField()
	logo = models.URLField(blank=True, null=True)
	is_verified = models.BooleanField(default=False)

	def __str__(self):
		return self.name



