from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import SupportTicket
from ..serializers import SupportTicketSerializer


class SupportTicketAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = SupportTicketSerializer
	queryset = SupportTicket.objects.select_related('user', 'assigned_to').all()
	search_fields = ('subject', 'description', 'user__phone', 'user__full_name', 'assigned_to__full_name')
