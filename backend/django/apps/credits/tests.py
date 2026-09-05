from django.test import TestCase

from apps.accounts.models import User
from apps.credits.models import CreditLedgerEntry
from apps.credits.models import CreditEconomyConfig
from apps.credits.services.catalog import CREDIT_ACTIONS, credits_for_amount
from apps.credits.services import get_or_create_wallet, spend_credits
from apps.credits.services.transfer_service import transfer_credits


class CreditWalletTests(TestCase):
	def setUp(self):
		self.user = User.objects.create_user(phone='254700000001', full_name='Employer', password='password', is_employer=True)

	def test_spend_rejects_insufficient_balance(self):
		with self.assertRaisesMessage(ValueError, 'Insufficient Kazi Credits.'):
			spend_credits(user=self.user, action='history_unlock', idempotency_key='history-1')

	def test_spend_is_idempotent(self):
		wallet = get_or_create_wallet(user=self.user)
		wallet.balance = 2
		wallet.save(update_fields=('balance',))
		first = spend_credits(user=self.user, action='history_unlock', idempotency_key='history-2')
		second = spend_credits(user=self.user, action='history_unlock', idempotency_key='history-2')
		wallet.refresh_from_db()
		self.assertEqual(first.id, second.id)
		self.assertEqual(wallet.balance, 1)
		self.assertEqual(CreditLedgerEntry.objects.filter(wallet=wallet).count(), 1)

	def test_transfer_moves_credits_between_wallets(self):
		recipient = User.objects.create_user(phone='254700000002', full_name='Recipient', password='password', is_worker=True)
		wallet = get_or_create_wallet(user=self.user)
		wallet.balance = 3
		wallet.save(update_fields=('balance',))
		transfer_credits(sender=self.user, recipient=recipient, amount=2, idempotency_key='transfer-1')
		wallet.refresh_from_db()
		recipient_wallet = get_or_create_wallet(user=recipient)
		recipient_wallet.refresh_from_db()
		self.assertEqual(wallet.balance, 1)
		self.assertEqual(recipient_wallet.balance, 2)

	def test_credit_economy_matches_product_rules(self):
		config = CreditEconomyConfig.current()
		self.assertEqual(config.ksh_per_credit, 50)
		self.assertEqual(config.minimum_recharge_ksh, 100)
		self.assertEqual(credits_for_amount(100), 2)
		self.assertEqual({key: item['credits'] for key, item in CREDIT_ACTIONS.items()}, {
			'history_unlock': 1,
			'application': 1,
			'featured_job_24h': 3,
			'job_boost_7d': 5,
			'premium_job_details': 1,
			'profile_boost_7d': 3,
		})

	def test_recharge_below_minimum_is_rejected(self):
		with self.assertRaisesMessage(ValueError, 'Recharge amount must be at least KSh 100'):
			credits_for_amount(50)
