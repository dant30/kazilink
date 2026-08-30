from django.urls import path

from .views.admin_views import FraudAlertAdminListView
from .views.api_views import FraudAlertDetailView, FraudAlertListView, FraudAlertStatusView

app_name = 'fraud'

urlpatterns = [
	path('', FraudAlertListView.as_view(), name='alert-list'),
	path('admin/list/', FraudAlertAdminListView.as_view(), name='alert-admin-list'),
	path('<int:pk>/', FraudAlertDetailView.as_view(), name='alert-detail'),
	path('<int:pk>/status/', FraudAlertStatusView.as_view(), name='alert-status'),
]
