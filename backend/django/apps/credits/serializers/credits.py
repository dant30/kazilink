from rest_framework import serializers
from django.contrib.auth import get_user_model

from ..models import CreditLedgerEntry, CreditRecharge, CreditWallet
from ..services.catalog import CREDIT_ACTIONS, credits_for_amount


class CreditWalletSerializer(serializers.ModelSerializer):
	class Meta:
		model = CreditWallet
		fields = ('balance', 'updated_at')


class CreditLedgerEntrySerializer(serializers.ModelSerializer):
	counterparty_name = serializers.SerializerMethodField()

	class Meta:
		model = CreditLedgerEntry
		fields = ('id', 'entry_type', 'amount', 'balance_before', 'balance_after', 'action', 'reference', 'metadata', 'counterparty_name', 'created_at')

	def get_counterparty_name(self, entry):
		metadata = entry.metadata or {}
		user_id = metadata.get('recipient_user_id') if entry.action == 'credit_transfer_sent' else metadata.get('sender_user_id')
		if not user_id:
			return ''
		user = get_user_model().objects.filter(pk=user_id).only('full_name').first()
		return user.full_name if user else ''


class CreditRechargeSerializer(serializers.ModelSerializer):
	class Meta:
		model = CreditRecharge
		fields = ('id', 'amount_ksh', 'credits', 'phone_number', 'status', 'provider_reference', 'created_at', 'completed_at')
		read_only_fields = ('id', 'credits', 'status', 'provider_reference', 'created_at', 'completed_at')


class CreditCatalogSerializer(serializers.Serializer):
	key = serializers.CharField()
	label = serializers.CharField()
	credits = serializers.IntegerField()
	roles = serializers.ListField(child=serializers.CharField())


class CreditSpendSerializer(serializers.Serializer):
	action = serializers.ChoiceField(choices=tuple((key, item['label']) for key, item in CREDIT_ACTIONS.items()))
	reference = serializers.CharField(max_length=100, required=False, allow_blank=True)
	idempotency_key = serializers.CharField(max_length=100)
	metadata = serializers.JSONField(required=False, default=dict)


class CreditTransferSerializer(serializers.Serializer):
	recipient_phone = serializers.CharField(max_length=20)
	amount = serializers.IntegerField(min_value=1)
	idempotency_key = serializers.CharField(max_length=100)


class CreditRechargeCreateSerializer(serializers.Serializer):
	amount_ksh = serializers.IntegerField(min_value=100)
	phone_number = serializers.CharField(max_length=20, required=False, allow_blank=True)

	def validate(self, attrs):
		try:
			attrs['credits'] = credits_for_amount(attrs['amount_ksh'])
		except ValueError as exc:
			raise serializers.ValidationError({'amount_ksh': str(exc)}) from exc
		return attrs
