from django.shortcuts import get_object_or_404
from urllib.error import HTTPError, URLError
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Transaction
from ..permissions import IsEmployer, IsPaymentOwner
from ..serializers import PaymentInitiateSerializer, TransactionSerializer
from ..services import create_pending_payment, fail_payment, refund_transaction
from ..services.mpesa import MpesaConfigurationError, initiate_stk_push


class TransactionListCreateView(generics.ListCreateAPIView):
	permission_classes = [IsEmployer]

	def get_queryset(self):
		return Transaction.objects.select_related('employer__user').filter(employer__user=self.request.user)

	def get_serializer_class(self):
		return PaymentInitiateSerializer if self.request.method == 'POST' else TransactionSerializer

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		data = serializer.validated_data
		if data['transaction_type'] != Transaction.TransactionType.SUBSCRIPTION:
			return Response({'detail': 'Platform actions must be paid with Kazi Credits. Only subscriptions use this payment endpoint.'}, status=status.HTTP_400_BAD_REQUEST)
		metadata = {**data.get('metadata', {}), 'phone_number': data.get('phone_number', '')}
		payment = create_pending_payment(
			employer=request.user.employer_profile,
			transaction_type=data['transaction_type'],
			amount_ksh=data['amount_ksh'],
			metadata=metadata,
		)
		try:
			provider_response = initiate_stk_push(transaction=payment, phone_number=data.get('phone_number', ''))
		except (MpesaConfigurationError, ValueError) as exc:
			fail_payment(transaction_id=payment.id, metadata={'provider_error': str(exc)})
			return Response({'detail': str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
		except HTTPError as exc:
			fail_payment(transaction_id=payment.id, metadata={'provider_error': str(exc)})
			return Response(
				{'detail': 'M-Pesa is temporarily unavailable. Please try again later.'},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)
		except (URLError, KeyError) as exc:
			fail_payment(transaction_id=payment.id, metadata={'provider_error': str(exc)})
			return Response({'detail': 'The payment provider could not be reached.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
		payment.provider_reference = provider_response.get('CheckoutRequestID', '')
		payment.save(update_fields=('provider_reference',))
		return Response(
			{'transaction': TransactionSerializer(payment).data, 'provider': provider_response},
			status=status.HTTP_202_ACCEPTED,
		)


class TransactionDetailView(generics.RetrieveAPIView):
	serializer_class = TransactionSerializer
	permission_classes = [IsPaymentOwner]

	def get_queryset(self):
		return Transaction.objects.select_related('employer__user').filter(employer__user=self.request.user)


class TransactionRefundView(APIView):
	permission_classes = [IsPaymentOwner]

	def post(self, request, pk):
		payment = get_object_or_404(Transaction.objects.select_related('employer__user'), pk=pk)
		self.check_object_permissions(request, payment)
		if payment.transaction_type != Transaction.TransactionType.SUBSCRIPTION:
			return Response({'detail': 'Platform action payments are no longer refundable because actions use Kazi Credits.'}, status=status.HTTP_400_BAD_REQUEST)
		try:
			payment = refund_transaction(transaction_id=payment.id)
		except ValueError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
		return Response(TransactionSerializer(payment).data)
