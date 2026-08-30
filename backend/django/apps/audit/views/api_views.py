from rest_framework import generics

from ..models import AuditLog
from ..permissions import IsAuditReviewer
from ..serializers import AuditLogSerializer


class AuditLogListView(generics.ListAPIView):
	permission_classes = [IsAuditReviewer]
	serializer_class = AuditLogSerializer

	def get_queryset(self):
		queryset = AuditLog.objects.select_related('actor').all()
		for field in ('action', 'target_type', 'target_id'):
			value = self.request.query_params.get(field)
			if value:
				queryset = queryset.filter(**{field: value})
		return queryset


class AuditLogDetailView(generics.RetrieveAPIView):
	permission_classes = [IsAuditReviewer]
	serializer_class = AuditLogSerializer
	queryset = AuditLog.objects.select_related('actor').all()
