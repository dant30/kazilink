from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import FraudAlert
from ..permissions import CanResolveFraudAlert, IsFraudReviewer
from ..serializers import FraudAlertSerializer, FraudAlertStatusSerializer
from ..services import resolve_alert


class FraudAlertListView(generics.ListAPIView):
	permission_classes = [IsFraudReviewer]
	serializer_class = FraudAlertSerializer

	def get_queryset(self):
		queryset = FraudAlert.objects.select_related('resolved_by').all()
		status_filter = self.request.query_params.get('status')
		severity = self.request.query_params.get('severity')
		if status_filter:
			queryset = queryset.filter(status=status_filter)
		if severity:
			queryset = queryset.filter(severity=severity)
		return queryset


class FraudAlertDetailView(generics.RetrieveAPIView):
	permission_classes = [IsFraudReviewer]
	serializer_class = FraudAlertSerializer
	queryset = FraudAlert.objects.select_related('resolved_by').all()


class FraudAlertStatusView(APIView):
	permission_classes = [CanResolveFraudAlert]

	def post(self, request, pk):
		alert = get_object_or_404(FraudAlert, pk=pk)
		self.check_object_permissions(request, alert)
		serializer = FraudAlertStatusSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		alert = resolve_alert(alert=alert, status=serializer.validated_data['status'], user=request.user)
		return Response(FraudAlertSerializer(alert).data, status=status.HTTP_200_OK)
