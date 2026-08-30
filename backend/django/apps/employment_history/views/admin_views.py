from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import EmploymentRecord
from ..serializers import EmploymentRecordSerializer, VerifyEmploymentSerializer
from ..services import review_record


class EmploymentVerificationQueueView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = EmploymentRecordSerializer
	queryset = EmploymentRecord.objects.select_related('worker__user').filter(
		verification_status=EmploymentRecord.VerificationStatus.PENDING
	).order_by('start_date')


class EmploymentVerificationView(APIView):
	permission_classes = [IsAdminUser]

	def patch(self, request, pk):
		record = EmploymentRecord.objects.select_related('worker__user').filter(pk=pk).first()
		if record is None:
			return Response({'detail': 'Employment record not found.'}, status=status.HTTP_404_NOT_FOUND)
		serializer = VerifyEmploymentSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		record = review_record(
			record=record,
			status=serializer.validated_data['status'],
			notes=serializer.validated_data.get('notes', ''),
			reviewer=request.user.get_full_name() or request.user.phone,
		)
		return Response(EmploymentRecordSerializer(record).data)
