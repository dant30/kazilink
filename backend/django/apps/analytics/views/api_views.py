from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import KPISnapshot
from ..permissions import IsAnalyticsViewer
from ..serializers import KPISnapshotSerializer, ReportRangeSerializer
from ..services import build_kpi_snapshot, export_snapshot_csv, latest_snapshot, snapshots_for_period


class KPISnapshotListView(generics.ListAPIView):
	permission_classes = [IsAnalyticsViewer]
	serializer_class = KPISnapshotSerializer

	def get_queryset(self):
		return snapshots_for_period(
			period_start=self.request.query_params.get('period_start'),
			period_end=self.request.query_params.get('period_end'),
		)


class KPISnapshotDetailView(generics.RetrieveAPIView):
	permission_classes = [IsAnalyticsViewer]
	serializer_class = KPISnapshotSerializer
	queryset = KPISnapshot.objects.all()


class LatestKPISnapshotView(APIView):
	permission_classes = [IsAnalyticsViewer]

	def get(self, request):
		snapshot = latest_snapshot()
		if not snapshot:
			return Response({'detail': 'No KPI snapshot is available.'}, status=status.HTTP_404_NOT_FOUND)
		return Response(KPISnapshotSerializer(snapshot).data)


class GenerateKPISnapshotView(APIView):
	permission_classes = [IsAnalyticsViewer]

	def post(self, request):
		serializer = ReportRangeSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		snapshot = build_kpi_snapshot(**serializer.validated_data)
		return Response(KPISnapshotSerializer(snapshot).data, status=status.HTTP_201_CREATED)


class KPISnapshotExportView(APIView):
	permission_classes = [IsAnalyticsViewer]

	def get(self, request, pk):
		snapshot = get_object_or_404(KPISnapshot, pk=pk)
		response = HttpResponse(export_snapshot_csv(snapshot), content_type='text/csv')
		response['Content-Disposition'] = f'attachment; filename="kpi-snapshot-{snapshot.period_start}-{snapshot.period_end}.csv"'
		return response
