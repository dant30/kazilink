from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import FraudAlert
from ..serializers import FraudAlertSerializer


class FraudAlertAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = FraudAlertSerializer
	queryset = FraudAlert.objects.select_related('resolved_by').all()
	search_fields = ('target_name', 'target_id', 'reason', 'details')
