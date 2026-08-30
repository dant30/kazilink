from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import User
from ..serializers import UserSerializer


class UserListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = UserSerializer
	queryset = User.objects.all().order_by('-joined_date')
	search_fields = ('phone', 'full_name', 'email')
