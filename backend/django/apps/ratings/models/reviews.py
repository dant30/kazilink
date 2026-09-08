from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Review(models.Model):
	target_worker = models.ForeignKey('accounts.WorkerProfile', on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')
	target_employer = models.ForeignKey('accounts.EmployerProfile', on_delete=models.CASCADE, null=True, blank=True, related_name='reviews_received')
	author = models.ForeignKey('accounts.EmployerProfile', on_delete=models.CASCADE, null=True, blank=True, related_name='reviews_authored')
	author_worker = models.ForeignKey('accounts.WorkerProfile', on_delete=models.CASCADE, null=True, blank=True, related_name='reviews_authored')
	job = models.ForeignKey('jobs.Job', on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
	author_name = models.CharField(max_length=255, blank=True)
	author_role = models.CharField(max_length=100, blank=True)
	author_avatar = models.URLField(blank=True, null=True)
	rating = models.DecimalField(max_digits=3, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(5)])
	comment = models.TextField()
	role_performed = models.CharField(max_length=100)
	establishment_name = models.CharField(max_length=255)
	date = models.DateField(auto_now_add=True)
	is_verified_hire = models.BooleanField(default=False)

	def __str__(self):
		target = self.target_worker or self.target_employer
		return f'{target.user.full_name if target else "Unknown target"} - {self.rating}'



