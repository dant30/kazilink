from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import EmployerProfile, User
from apps.credits.models import CreditLedgerEntry, CreditRecharge
from apps.credits.services import get_or_create_wallet


class CreditPaymentBoundaryTests(TestCase):
	def setUp(self):
		self.user = User.objects.create_user(
			phone='254722000001', full_name='Employer', password='password', is_employer=True,
		)
		self.employer = EmployerProfile.objects.create(user=self.user, contact_person='Employer')
		self.client = APIClient()

	def test_native_daraja_callback_settles_recharge_once(self):
		wallet = get_or_create_wallet(user=self.user)
		recharge = CreditRecharge.objects.create(
			wallet=wallet,
			amount_ksh=100,
			credits=2,
			phone_number=self.user.phone,
			provider_reference='ws_CO_callback_1',
		)
		payload = {
			'Body': {
				'stkCallback': {
					'CheckoutRequestID': recharge.provider_reference,
					'ResultCode': 0,
					'ResultDesc': 'The service request is processed successfully.',
				},
			},
		}
		first = self.client.post('/api/payments/webhooks/mpesa/', payload, format='json')
		second = self.client.post('/api/payments/webhooks/mpesa/', payload, format='json')
		wallet.refresh_from_db()
		self.assertEqual(first.status_code, 200)
		self.assertEqual(second.status_code, 200)
		self.assertEqual(wallet.balance, 2)
		self.assertEqual(CreditLedgerEntry.objects.filter(action='recharge').count(), 1)

	def test_legacy_platform_payment_is_rejected(self):
		self.client.force_authenticate(user=self.user)
		response = self.client.post('/api/payments/', {
			'transaction_type': 'history_unlock',
			'amount_ksh': 100,
			'phone_number': self.user.phone,
		}, format='json')
		self.assertEqual(response.status_code, 400)
		self.assertIn('Kazi Credits', response.data['detail'])