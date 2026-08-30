from django.urls import path

from .views.admin_views import ApplicationAdminListView
from .views.api_views import (
	ApplicationDetailView,
	ApplicationListCreateView,
	ApplicationStatusView,
	EmployerApplicationsView,
	WorkerApplicationsView,
)

app_name = 'job_applications'

urlpatterns = [
	path('', ApplicationListCreateView.as_view(), name='application-list-create'),
	path('mine/', WorkerApplicationsView.as_view(), name='worker-applications'),
	path('employer/', EmployerApplicationsView.as_view(), name='employer-applications'),
	path('admin/list/', ApplicationAdminListView.as_view(), name='application-admin-list'),
	path('<int:pk>/', ApplicationDetailView.as_view(), name='application-detail'),
	path('<int:pk>/status/', ApplicationStatusView.as_view(), name='application-status'),
]
