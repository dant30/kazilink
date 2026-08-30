from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import Subscription
from ..serializers import SubscriptionSerializer


class SubscriptionAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = SubscriptionSerializer
	queryset = Subscription.objects.select_related('employer__user').all()
	search_fields = ('employer__user__phone', 'employer__user__full_name', 'plan', 'provider_reference')
