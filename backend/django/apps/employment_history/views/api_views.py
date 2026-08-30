from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import EmploymentRecord, HistoryAccessLog
from ..permissions import IsEmployerHistoryViewer, IsWorkerOwner
from ..serializers import (
	EmploymentRecordSerializer,
	HistoryConsentSerializer,
	HistoryAccessLogSerializer,
	UnlockHistorySerializer,
)
from ..services import can_view_history, create_record, create_unlock_transaction, update_record
from apps.accounts.models import WorkerProfile


class WorkerHistoryListCreateView(generics.ListCreateAPIView):
	permission_classes = [IsWorkerOwner]

	def get_permissions(self):
		if self.request.method == 'POST' and getattr(self.request.user, 'is_employer', False):
			return [IsEmployerHistoryViewer()]
		return [IsWorkerOwner()]

	def get_serializer_class(self):
		return EmploymentRecordSerializer

	def get_queryset(self):
		if getattr(self.request.user, 'is_employer', False):
			return EmploymentRecord.objects.filter(employer__user=self.request.user).order_by('-is_current', '-start_date')
		return EmploymentRecord.objects.filter(worker__user=self.request.user).order_by('-is_current', '-start_date')

	def perform_create(self, serializer):
		if getattr(self.request.user, 'is_employer', False):
			worker_id = serializer.validated_data.get('worker_id') or serializer.validated_data.get('worker')
			if worker_id is None:
				raise ValueError('A worker is required.')
			self.record = create_record(
				employer=self.request.user.employer_profile,
				worker=worker_id,
				validated_data=serializer.validated_data,
			)
			return
		self.record = create_record(worker=self.request.user.worker_profile, validated_data=serializer.validated_data)

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		try:
			self.perform_create(serializer)
		except (PermissionError, ValueError) as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_403_FORBIDDEN if isinstance(exc, PermissionError) else status.HTTP_400_BAD_REQUEST)
		return Response(EmploymentRecordSerializer(self.record).data, status=status.HTTP_201_CREATED)


class WorkerHistoryDetailView(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = [IsWorkerOwner]
	serializer_class = EmploymentRecordSerializer

	def get_queryset(self):
		return EmploymentRecord.objects.filter(worker__user=self.request.user)

	def perform_update(self, serializer):
		self.record = update_record(record=self.get_object(), validated_data=serializer.validated_data)


class EmployerHistoryAccessView(APIView):
	permission_classes = [IsEmployerHistoryViewer]

	def get(self, request, worker_id):
		worker = get_object_or_404(WorkerProfile, pk=worker_id)
		if not can_view_history(employer=request.user.employer_profile, worker=worker):
			return Response({'detail': 'Employment history is locked or the worker has not consented.'}, status=status.HTTP_403_FORBIDDEN)
		records = EmploymentRecord.objects.filter(worker=worker).order_by('-is_current', '-start_date')
		return Response(EmploymentRecordSerializer(records, many=True).data)


class UnlockHistoryView(APIView):
	permission_classes = [IsEmployerHistoryViewer]

	def post(self, request):
		serializer = UnlockHistorySerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		worker = get_object_or_404(WorkerProfile, pk=serializer.validated_data['worker_id'])
		try:
			transaction = create_unlock_transaction(
				employer=request.user.employer_profile,
				worker=worker,
				amount_ksh=serializer.validated_data['amount_ksh'],
			)
		except PermissionError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_403_FORBIDDEN)
		except ValueError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
		return Response({'transaction_id': transaction.id, 'status': transaction.status}, status=status.HTTP_202_ACCEPTED)


class MyHistoryAccessView(generics.ListAPIView):
	permission_classes = [IsEmployerHistoryViewer]
	serializer_class = HistoryAccessLogSerializer

	def get_queryset(self):
		return HistoryAccessLog.objects.select_related('worker__user', 'employer__user', 'transaction').filter(
			employer__user=self.request.user
		).order_by('-unlocked_at')


class HistoryConsentView(APIView):
	permission_classes = [IsWorkerOwner]

	def patch(self, request):
		serializer = HistoryConsentSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		worker = request.user.worker_profile
		worker.consent_history_sharing = serializer.validated_data['consent_history_sharing']
		worker.save(update_fields=['consent_history_sharing'])
		return Response({'consent_history_sharing': worker.consent_history_sharing})
