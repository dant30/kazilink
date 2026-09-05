from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import User
from ..serializers import ReferralSerializer, UserSerializer
from ..models import Referral


class UserListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = UserSerializer
	queryset = User.objects.all().order_by('-joined_date')
	search_fields = ('phone', 'full_name', 'email')


class ReferralAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = ReferralSerializer
	queryset = Referral.objects.select_related('code', 'referrer', 'referred').all()
	search_fields = ('code__code', 'referrer__phone', 'referred__phone', 'referrer__full_name', 'referred__full_name')
