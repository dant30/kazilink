from django.test import TestCase

from apps.accounts.models import User
from apps.accounts.serializers.user import RegistrationSerializer


class RegistrationNameTests(TestCase):
	def test_user_manager_stores_title_cased_name(self):
		user = User.objects.create_user(phone='254700000301', full_name="  jane o'brien  ", password='Password1!')
		self.assertEqual(user.full_name, "Jane O'Brien")

	def test_registration_serializer_normalizes_name(self):
		serializer = RegistrationSerializer(data={
			'phone': '254700000302',
			'full_name': 'mary jane doe',
			'password': 'Password1!',
			'email': 'mary@example.com',
			'role': 'employer',
			'contact_person': 'Mary Jane Doe',
			'terms_accepted': True,
			'privacy_policy_accepted': True,
		})
		self.assertTrue(serializer.is_valid(), serializer.errors)
		self.assertEqual(serializer.validated_data['full_name'], 'Mary Jane Doe')