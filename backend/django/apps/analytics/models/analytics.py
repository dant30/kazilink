from django.db import models


class KPISnapshot(models.Model):
	period_start = models.DateField()
	period_end = models.DateField()
	registered_workers = models.PositiveIntegerField(default=0)
	active_employers = models.PositiveIntegerField(default=0)
	jobs_posted = models.PositiveIntegerField(default=0)
	applications = models.PositiveIntegerField(default=0)
	successful_hires = models.PositiveIntegerField(default=0)
	paid_unlocks = models.PositiveIntegerField(default=0)
	premium_purchase_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
	average_revenue_per_paying_employer_ksh = models.DecimalField(max_digits=12, decimal_places=2, default=0)
	repeat_employer_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
	customer_acquisition_cost_ksh = models.DecimalField(max_digits=12, decimal_places=2, default=0)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		constraints = [models.UniqueConstraint(fields=['period_start', 'period_end'], name='unique_kpi_snapshot_period')]
		ordering = ['-period_end']
		indexes = [models.Index(fields=['-period_end'])]

	def __str__(self):
		return f'KPI snapshot {self.period_start} to {self.period_end}'



