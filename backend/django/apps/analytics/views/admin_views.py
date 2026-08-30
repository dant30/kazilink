from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import KPISnapshot
from ..serializers import KPISnapshotSerializer


class KPISnapshotAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = KPISnapshotSerializer
	queryset = KPISnapshot.objects.all()
