from rest_framework import serializers

from ..models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
	employer_name = serializers.CharField(source='employer.user.full_name', read_only=True)

	class Meta:
		model = Subscription
		fields = ('id', 'employer', 'employer_name', 'plan', 'status', 'started_at', 'expires_at', 'auto_renew', 'provider_reference')
		read_only_fields = ('id', 'employer', 'employer_name', 'status', 'started_at', 'expires_at', 'provider_reference')


class SubscriptionCheckoutSerializer(serializers.Serializer):
	plan = serializers.CharField(max_length=20)
	phone_number = serializers.CharField(max_length=20)

	def validate_plan(self, value):
		value = value.strip().lower()
		from apps.accounts.models import EmployerProfile

		valid_plans = {choice for choice, label in EmployerProfile.SubscriptionPlan.choices}
		if value not in valid_plans:
			raise serializers.ValidationError('Choose a valid subscription plan.')
		if not value:
			raise serializers.ValidationError('A subscription plan is required.')
		return value

	def validate_phone_number(self, value):
		return value.strip()