from django.shortcuts import get_object_or_404
from urllib.error import HTTPError, URLError

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.payments.services import create_pending_payment, fail_payment
from apps.payments.services.mpesa import MpesaConfigurationError, initiate_stk_push

from ..models import Subscription
from ..permissions import IsEmployer, IsSubscriptionOwner
from ..serializers import SubscriptionCheckoutSerializer, SubscriptionSerializer
from ..services import cancel_subscription, subscription_for_employer


class SubscriptionListView(generics.ListAPIView):
	permission_classes = [IsEmployer]
	serializer_class = SubscriptionSerializer

	def get_queryset(self):
		return subscription_for_employer(self.request.user.employer_profile)


class SubscriptionCheckoutView(APIView):
	permission_classes = [IsEmployer]

	def post(self, request):
		serializer = SubscriptionCheckoutSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		data = serializer.validated_data
		payment = create_pending_payment(
			employer=request.user.employer_profile,
			transaction_type='subscription',
			amount_ksh=data['amount_ksh'],
			metadata={'subscription_plan': data['plan'], 'duration_days': data['duration_days']},
		)
		try:
			provider_response = initiate_stk_push(transaction=payment, phone_number=data['phone_number'])
		except (MpesaConfigurationError, ValueError) as exc:
			fail_payment(transaction_id=payment.id, metadata={'provider_error': str(exc)})
			return Response({'detail': str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
		except (HTTPError, URLError, KeyError) as exc:
			fail_payment(transaction_id=payment.id, metadata={'provider_error': str(exc)})
			return Response({'detail': 'The payment provider could not be reached.'}, status=status.HTTP_502_BAD_GATEWAY)
		payment.provider_reference = provider_response.get('CheckoutRequestID', '')
		payment.save(update_fields=('provider_reference',))
		return Response({'payment_id': payment.id, 'status': payment.status, 'provider': provider_response}, status=status.HTTP_202_ACCEPTED)


class SubscriptionDetailView(generics.RetrieveAPIView):
	permission_classes = [IsSubscriptionOwner]
	serializer_class = SubscriptionSerializer

	def get_queryset(self):
		return Subscription.objects.select_related('employer__user').filter(employer__user=self.request.user)


class SubscriptionCancelView(APIView):
	permission_classes = [IsSubscriptionOwner]

	def post(self, request, pk):
		subscription = get_object_or_404(Subscription.objects.select_related('employer__user'), pk=pk)
		self.check_object_permissions(request, subscription)
		return Response(SubscriptionSerializer(cancel_subscription(subscription=subscription)).data)
