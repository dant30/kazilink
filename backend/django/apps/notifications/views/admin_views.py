from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import Notification
from ..serializers import NotificationSerializer


class NotificationAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = NotificationSerializer
	queryset = Notification.objects.select_related('user').all()
	search_fields = ('user__phone', 'user__full_name', 'title', 'message')
