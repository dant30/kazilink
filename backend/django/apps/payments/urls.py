from django.urls import path

from .views.admin_views import TransactionAdminListView
from .views.api_views import TransactionDetailView, TransactionListCreateView, TransactionRefundView
from .webhooks import mpesa_callback

app_name = 'payments'

urlpatterns = [
	path('', TransactionListCreateView.as_view(), name='transaction-list-create'),
	path('admin/list/', TransactionAdminListView.as_view(), name='transaction-admin-list'),
	path('webhooks/mpesa/', mpesa_callback, name='mpesa-callback'),
	path('<int:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
	path('<int:pk>/refund/', TransactionRefundView.as_view(), name='transaction-refund'),
]
