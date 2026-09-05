from urllib.error import HTTPError, URLError

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.payments.services.mpesa import MpesaConfigurationError, initiate_stk_push

from ..models import CreditLedgerEntry, CreditRecharge
from ..serializers import CreditCatalogSerializer, CreditLedgerEntrySerializer, CreditRechargeCreateSerializer, CreditRechargeSerializer, CreditSpendSerializer, CreditWalletSerializer
from ..services.catalog import credit_catalog
from ..services.wallet_service import get_or_create_wallet, record_ledger_entry, spend_credits


class CreditCatalogView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		catalog = [dict(key=key, **value) for key, value in credit_catalog().items()]
		return Response({'currency': 'Kazi Credits', 'ksh_per_credit': 20, 'actions': CreditCatalogSerializer(catalog, many=True).data})


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
			metadata={'credit_rate_ksh': 20},
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
