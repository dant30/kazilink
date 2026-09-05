from django.test import TestCase

from apps.accounts.models import User
from apps.credits.models import CreditLedgerEntry
from apps.credits.services import get_or_create_wallet, spend_credits


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
