from django.urls import path

from .views.admin_views import JobAdminListView
from .views.api_views import CloseJobView, JobDetailView, JobListCreateView, RecommendedJobsView

app_name = 'jobs'

urlpatterns = [
	path('', JobListCreateView.as_view(), name='job-list-create'),
	path('recommended/', RecommendedJobsView.as_view(), name='recommended-jobs'),
	path('admin/list/', JobAdminListView.as_view(), name='job-admin-list'),
	path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
	path('<int:pk>/close/', CloseJobView.as_view(), name='job-close'),
]
