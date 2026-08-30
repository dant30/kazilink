from django.urls import path

from .views.admin_views import NotificationAdminListView
from .views.api_views import (
	MarkAllNotificationsReadView,
	MarkNotificationReadView,
	NotificationDetailView,
	NotificationListView,
	NotificationPreferenceView,
)

app_name = 'notifications'

urlpatterns = [
	path('', NotificationListView.as_view(), name='list'),
	path('read-all/', MarkAllNotificationsReadView.as_view(), name='read-all'),
	path('preferences/', NotificationPreferenceView.as_view(), name='preferences'),
	path('admin/list/', NotificationAdminListView.as_view(), name='admin-list'),
	path('<int:pk>/', NotificationDetailView.as_view(), name='detail'),
	path('<int:pk>/read/', MarkNotificationReadView.as_view(), name='read'),
]
