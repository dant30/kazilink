from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import JobApplication
from ..serializers import JobApplicationSerializer


class ApplicationAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = JobApplicationSerializer
	queryset = JobApplication.objects.select_related('job__employer__user', 'worker__user').order_by('-applied_date')
	search_fields = ('job__title', 'worker__user__phone', 'worker__user__full_name')
