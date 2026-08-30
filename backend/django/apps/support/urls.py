from django.urls import path

from .views.admin_views import SupportTicketAdminListView
from .views.api_views import StaffTicketUpdateView, TicketCloseView, TicketDetailView, TicketListCreateView

app_name = 'support'

urlpatterns = [
	path('', TicketListCreateView.as_view(), name='ticket-list-create'),
	path('admin/list/', SupportTicketAdminListView.as_view(), name='ticket-admin-list'),
	path('admin/<int:pk>/', StaffTicketUpdateView.as_view(), name='ticket-staff-update'),
	path('<int:pk>/', TicketDetailView.as_view(), name='ticket-detail'),
	path('<int:pk>/close/', TicketCloseView.as_view(), name='ticket-close'),
]
