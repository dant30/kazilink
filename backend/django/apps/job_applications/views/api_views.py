from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import JobApplication
from ..permissions import CanReviewApplication, CanViewApplication, IsEmployerReviewer, IsWorkerApplicant
from ..serializers import ApplicationCreateSerializer, ApplicationStatusSerializer, JobApplicationSerializer
from ..services import create_application, update_application_status


class ApplicationListCreateView(generics.ListCreateAPIView):
	def get_permissions(self):
		return [IsWorkerApplicant()] if self.request.method == 'POST' else [CanViewApplication()]

	def get_serializer_class(self):
		return ApplicationCreateSerializer if self.request.method == 'POST' else JobApplicationSerializer

	def get_queryset(self):
		queryset = JobApplication.objects.select_related(
			'job__employer__user', 'worker__user'
		).order_by('-applied_date')
		user = self.request.user
		if user.is_staff or user.is_superuser:
			return queryset
		if user.is_worker:
			return queryset.filter(worker__user=user)
		return queryset.filter(job__employer__user=user)

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		job = serializer.validated_data['job']
		try:
			application = create_application(
				worker=request.user.worker_profile,
				job=job,
				cover_note=serializer.validated_data.get('cover_note', ''),
			)
		except PermissionError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_403_FORBIDDEN)
		except ValueError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
		return Response(JobApplicationSerializer(application).data, status=status.HTTP_201_CREATED)


class ApplicationDetailView(generics.RetrieveAPIView):
	queryset = JobApplication.objects.select_related('job__employer__user', 'worker__user')
	serializer_class = JobApplicationSerializer
	permission_classes = [CanViewApplication]

	def get_object(self):
		application = get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])
		self.check_object_permissions(self.request, application)
		return application


class ApplicationStatusView(APIView):
	permission_classes = [CanReviewApplication]

	def patch(self, request, pk):
		application = get_object_or_404(
			JobApplication.objects.select_related('job__employer__user', 'worker__user'), pk=pk
		)
		self.check_object_permissions(request, application)
		serializer = ApplicationStatusSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		try:
			application = update_application_status(application=application, **serializer.validated_data)
		except ValueError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
		return Response(JobApplicationSerializer(application).data)


class EmployerApplicationsView(generics.ListAPIView):
	permission_classes = [IsEmployerReviewer]
	serializer_class = JobApplicationSerializer

	def get_queryset(self):
		queryset = JobApplication.objects.select_related('job__employer__user', 'worker__user').filter(
			job__employer__user=self.request.user
		)
		status_filter = self.request.query_params.get('status')
		if status_filter:
			queryset = queryset.filter(status=status_filter)
		return queryset.order_by('-applied_date')


class WorkerApplicationsView(generics.ListAPIView):
	permission_classes = [IsWorkerApplicant]
	serializer_class = JobApplicationSerializer

	def get_queryset(self):
		return JobApplication.objects.select_related('job__employer__user', 'worker__user').filter(
			worker__user=self.request.user
		).order_by('-applied_date')
