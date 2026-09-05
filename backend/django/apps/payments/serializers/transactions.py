from rest_framework import serializers

from ..models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
	employer_name = serializers.CharField(source='employer.user.full_name', read_only=True)

	class Meta:
		model = Transaction
		fields = (
			'id', 'employer', 'employer_name', 'transaction_type', 'amount_ksh', 'status',
			'provider', 'provider_reference', 'metadata', 'created_at', 'completed_at',
		)
		read_only_fields = ('id', 'employer', 'employer_name', 'status', 'provider_reference', 'metadata', 'created_at', 'completed_at')


class PaymentInitiateSerializer(serializers.Serializer):
	transaction_type = serializers.ChoiceField(choices=((Transaction.TransactionType.SUBSCRIPTION, 'Subscription'),))
	amount_ksh = serializers.IntegerField(min_value=1)
	phone_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
	metadata = serializers.JSONField(required=False, default=dict)

	def validate_phone_number(self, value):
		return value.strip()