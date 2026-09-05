from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsWorker

from ..models import Job
from ..permissions import CanManageJob, IsEmployer, IsJobParticipant
from ..serializers import JobSerializer, JobWriteSerializer
from ..services import close_job, create_job, match_jobs_for_worker, search_jobs, update_job


def query_bool(value):
	if value is None or value == '':
		return None
	if value.lower() in {'true', '1', 'yes', 'on'}:
		return True
	if value.lower() in {'false', '0', 'no', 'off'}:
		return False
	raise ValidationError({'detail': f'Invalid boolean value: {value}.'})


class JobListCreateView(generics.ListCreateAPIView):
	permission_classes = [IsEmployer]
	serializer_class = JobSerializer

	def get_permissions(self):
		return [IsEmployer()] if self.request.method == 'POST' else [AllowAny()]

	def get_queryset(self):
		params = self.request.query_params
		return search_jobs(
			query=params.get('q', ''),
			location=params.get('location', ''),
			category=params.get('category', ''),
			job_type=params.get('job_type', ''),
			status=params.get('status', Job.Status.OPEN),
			min_pay=params.get('min_pay') or None,
			max_pay=params.get('max_pay') or None,
			featured=query_bool(params.get('featured')),
			urgent=query_bool(params.get('urgent')),
		)

	def create(self, request, *args, **kwargs):
		serializer = JobWriteSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		try:
			job = create_job(employer=request.user.employer_profile, validated_data=serializer.validated_data)
		except PermissionError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_403_FORBIDDEN)
		return Response(JobSerializer(job).data, status=status.HTTP_201_CREATED)


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Job.objects.select_related('employer__user', 'establishment')
	serializer_class = JobSerializer

	def get_permissions(self):
		return [CanManageJob()] if self.request.method in ('PUT', 'PATCH', 'DELETE') else [IsJobParticipant()]

	def get_serializer_class(self):
		return JobWriteSerializer if self.request.method in ('PUT', 'PATCH') else JobSerializer

	def perform_update(self, serializer):
		try:
			update_job(job=self.get_object(), validated_data=serializer.validated_data)
		except PermissionError as exc:
			from rest_framework.exceptions import PermissionDenied
			raise PermissionDenied(str(exc))


class CloseJobView(APIView):
	permission_classes = [CanManageJob]

	def post(self, request, pk):
		job = get_object_or_404(Job.objects.select_related('employer__user', 'establishment'), pk=pk)
		self.check_object_permissions(request, job)
		close_job(job=job)
		return Response(JobSerializer(job).data)


class RecommendedJobsView(generics.ListAPIView):
	permission_classes = [IsWorker]
	serializer_class = JobSerializer

	def get_queryset(self):
		return match_jobs_for_worker(self.request.user.worker_profile)
