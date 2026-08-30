from django.urls import path

from .views.admin_views import AuditLogAdminListView
from .views.api_views import AuditLogDetailView, AuditLogListView

app_name = 'audit'

urlpatterns = [
	path('', AuditLogListView.as_view(), name='log-list'),
	path('admin/list/', AuditLogAdminListView.as_view(), name='admin-list'),
	path('<int:pk>/', AuditLogDetailView.as_view(), name='log-detail'),
]
