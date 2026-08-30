from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import Job
from ..serializers import JobSerializer


class JobAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = JobSerializer
	queryset = Job.objects.select_related('employer__user', 'establishment').order_by('-posted_date')
	search_fields = ('title', 'description', 'category', 'location')
