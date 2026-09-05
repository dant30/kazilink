from django.db import models


class CreditEconomyConfig(models.Model):
	ksh_per_credit = models.PositiveIntegerField(default=50)
	minimum_recharge_ksh = models.PositiveIntegerField(default=100)
	referrer_reward_credits = models.PositiveIntegerField(default=5)
	referred_reward_credits = models.PositiveIntegerField(default=2)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = 'Credit economy configuration'
		verbose_name_plural = 'Credit economy configuration'

	@classmethod
	def current(cls):
		config, _ = cls.objects.get_or_create(pk=1)
		return config

	def __str__(self):
		return f'KSh {self.ksh_per_credit} per Kazi Credit'