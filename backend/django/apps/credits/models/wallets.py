from django.conf import settings
from django.db import models
from django.utils import timezone


class CreditWallet(models.Model):
	user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='credit_wallet')
	balance = models.PositiveIntegerField(default=0)
	created_at = models.DateTimeField(default=timezone.now)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f'{self.user} - {self.balance} Kazi Credits'


class CreditRecharge(models.Model):
	class Status(models.TextChoices):
		PENDING = 'pending', 'Pending'
		COMPLETED = 'completed', 'Completed'
		FAILED = 'failed', 'Failed'

	wallet = models.ForeignKey(CreditWallet, on_delete=models.PROTECT, related_name='recharges')
	amount_ksh = models.PositiveIntegerField()
	credits = models.PositiveIntegerField()
	phone_number = models.CharField(max_length=20)
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
	provider = models.CharField(max_length=30, default='mpesa')
	provider_reference = models.CharField(max_length=100, blank=True)
	metadata = models.JSONField(default=dict, blank=True)
	created_at = models.DateTimeField(default=timezone.now)
	completed_at = models.DateTimeField(null=True, blank=True)

	def __str__(self):
		return f'{self.wallet.user} - KSh {self.amount_ksh} ({self.status})'


class CreditLedgerEntry(models.Model):
	class EntryType(models.TextChoices):
		RECHARGE = 'recharge', 'Recharge'
		SPEND = 'spend', 'Spend'
		REFUND = 'refund', 'Refund'
		PROMOTION = 'promotion', 'Promotion'
		ADJUSTMENT = 'adjustment', 'Adjustment'

	wallet = models.ForeignKey(CreditWallet, on_delete=models.PROTECT, related_name='ledger_entries')
	entry_type = models.CharField(max_length=20, choices=EntryType.choices)
	amount = models.IntegerField()
	balance_before = models.PositiveIntegerField()
	balance_after = models.PositiveIntegerField()
	action = models.CharField(max_length=50, blank=True)
	reference = models.CharField(max_length=100, blank=True)
	idempotency_key = models.CharField(max_length=100, blank=True)
	metadata = models.JSONField(default=dict, blank=True)
	created_at = models.DateTimeField(default=timezone.now)

	class Meta:
		ordering = ('-created_at', '-id')
		constraints = [
			models.UniqueConstraint(
				fields=('wallet', 'idempotency_key'),
				condition=~models.Q(idempotency_key=''),
				name='credits_wallet_idempotency_key_unique',
			)
		]
