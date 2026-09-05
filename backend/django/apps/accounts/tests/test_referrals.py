from django.test import TestCase

from apps.accounts.models import User
from apps.accounts.services.referrals import ensure_referral_code, resolve_referral_code, reward_referral
from apps.credits.models import CreditLedgerEntry
from apps.credits.services.wallet_service import get_or_create_wallet


class ReferralTests(TestCase):
	def setUp(self):
		self.referrer = User.objects.create_user(phone='254700000101', full_name='Referrer', password='password', is_worker=True)
		self.referred = User.objects.create_user(phone='254700000102', full_name='Referred', password='password', is_worker=True)

	def test_users_receive_unique_code(self):
		code = ensure_referral_code(user=self.referrer)
		self.assertTrue(code.startswith('KAZI-'))
		self.assertEqual(code, ensure_referral_code(user=self.referrer))

	def test_verification_reward_is_granted_once(self):
		code = ensure_referral_code(user=self.referrer)
		referral = resolve_referral_code(code=code, referred_user=self.referred)
		reward_referral(user=self.referred)
		reward_referral(user=self.referred)
		referrer_wallet = get_or_create_wallet(user=self.referrer)
		referred_wallet = get_or_create_wallet(user=self.referred)
		referrer_wallet.refresh_from_db()
		referred_wallet.refresh_from_db()
		self.assertEqual(referral.status, 'rewarded')
		self.assertEqual(referrer_wallet.balance, 5)
		self.assertEqual(referred_wallet.balance, 2)
		self.assertEqual(CreditLedgerEntry.objects.filter(action__startswith='referral').count(), 2)
