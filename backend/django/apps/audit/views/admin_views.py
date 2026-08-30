from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import AuditLog
from ..serializers import AuditLogSerializer


class AuditLogAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = AuditLogSerializer
	queryset = AuditLog.objects.select_related('actor').all()
	search_fields = ('action', 'target_type', 'target_id', 'actor__phone', 'actor__full_name')
