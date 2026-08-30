from django.urls import path

from .views.admin_views import KPISnapshotAdminListView
from .views.api_views import (
	GenerateKPISnapshotView,
	KPISnapshotDetailView,
	KPISnapshotExportView,
	KPISnapshotListView,
	LatestKPISnapshotView,
)

app_name = 'analytics'

urlpatterns = [
	path('', KPISnapshotListView.as_view(), name='snapshot-list'),
	path('latest/', LatestKPISnapshotView.as_view(), name='snapshot-latest'),
	path('generate/', GenerateKPISnapshotView.as_view(), name='snapshot-generate'),
	path('admin/list/', KPISnapshotAdminListView.as_view(), name='snapshot-admin-list'),
	path('<int:pk>/', KPISnapshotDetailView.as_view(), name='snapshot-detail'),
	path('<int:pk>/export/', KPISnapshotExportView.as_view(), name='snapshot-export'),
]
