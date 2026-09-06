from urllib.error import HTTPError, URLError

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.payments.services.mpesa import MpesaConfigurationError, initiate_stk_push

from django.contrib.auth import get_user_model
from ..models import CreditEconomyConfig, CreditLedgerEntry, CreditRecharge
from ..serializers import CreditCatalogSerializer, CreditLedgerEntrySerializer, CreditRechargeCreateSerializer, CreditRechargeSerializer, CreditSpendSerializer, CreditTransferSerializer, CreditWalletSerializer
from ..services.catalog import credit_catalog
from ..services.wallet_service import get_or_create_wallet, record_ledger_entry, spend_credits
from ..services.transfer_service import transfer_credits


class CreditCatalogView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		catalog = [dict(key=key, **value) for key, value in credit_catalog().items()]
		config = CreditEconomyConfig.current()
		return Response({'currency': 'Kazi Credits', 'ksh_per_credit': config.ksh_per_credit, 'minimum_recharge_ksh': config.minimum_recharge_ksh, 'actions': CreditCatalogSerializer(catalog, many=True).data})


class CreditWalletView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		wallet = get_or_create_wallet(user=request.user)
		entries = wallet.ledger_entries.all()[:50]
		return Response({'wallet': CreditWalletSerializer(wallet).data, 'ledger': CreditLedgerEntrySerializer(entries, many=True).data})


class CreditRechargeView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		serializer = CreditRechargeCreateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		phone_number = serializer.validated_data.get('phone_number') or request.user.phone
		wallet = get_or_create_wallet(user=request.user)
		recharge = CreditRecharge.objects.create(
			wallet=wallet,
			amount_ksh=serializer.validated_data['amount_ksh'],
			credits=serializer.validated_data['credits'],
			phone_number=phone_number,
			metadata={'credit_rate_ksh': CreditEconomyConfig.current().ksh_per_credit},
		)
		try:
			provider_response = initiate_stk_push(transaction=recharge, phone_number=phone_number)
		except (MpesaConfigurationError, ValueError) as exc:
			recharge.status = CreditRecharge.Status.FAILED
			recharge.metadata = {**recharge.metadata, 'provider_error': str(exc)}
			recharge.save(update_fields=('status', 'metadata'))
			return Response({'detail': str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
		except (HTTPError, URLError, KeyError):
			recharge.status = CreditRecharge.Status.FAILED
			recharge.save(update_fields=('status',))
			return Response({'detail': 'M-Pesa is temporarily unavailable. Please try again later.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
		recharge.provider_reference = provider_response.get('CheckoutRequestID', '')
		recharge.metadata = {**recharge.metadata, 'provider_response': provider_response}
		recharge.save(update_fields=('provider_reference', 'metadata'))
		return Response(CreditRechargeSerializer(recharge).data, status=status.HTTP_202_ACCEPTED)


class CreditRechargeStatusView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, recharge_id):
		recharge = CreditRecharge.objects.filter(id=recharge_id, wallet__user=request.user).first()
		if recharge is None:
			return Response({'detail': 'Recharge not found.'}, status=status.HTTP_404_NOT_FOUND)
		return Response(CreditRechargeSerializer(recharge).data)


class CreditSpendView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		serializer = CreditSpendSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		try:
			entry = spend_credits(user=request.user, **serializer.validated_data)
		except PermissionError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_403_FORBIDDEN)
		except ValueError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
		return Response(CreditLedgerEntrySerializer(entry).data, status=status.HTTP_201_CREATED)


class CreditTransferView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		serializer = CreditTransferSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		User = get_user_model()
		recipient = User.objects.filter(phone=serializer.validated_data['recipient_phone']).first()
		if recipient is None:
			return Response({'detail': 'Recipient account was not found.'}, status=status.HTTP_404_NOT_FOUND)
		try:
			entry = transfer_credits(sender=request.user, recipient=recipient, amount=serializer.validated_data['amount'], idempotency_key=serializer.validated_data['idempotency_key'])
		except ValueError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
		return Response(CreditLedgerEntrySerializer(entry).data, status=status.HTTP_201_CREATED)
