from django.urls import path

from .views.admin_views import SubscriptionAdminListView
from .views.api_views import SubscriptionCancelView, SubscriptionCheckoutView, SubscriptionDetailView, SubscriptionListView, SubscriptionPlansView

app_name = 'subscriptions'

urlpatterns = [
	path('', SubscriptionListView.as_view(), name='list'),
	path('plans/', SubscriptionPlansView.as_view(), name='plans'),
	path('checkout/', SubscriptionCheckoutView.as_view(), name='checkout'),
	path('admin/list/', SubscriptionAdminListView.as_view(), name='admin-list'),
	path('<int:pk>/', SubscriptionDetailView.as_view(), name='detail'),
	path('<int:pk>/cancel/', SubscriptionCancelView.as_view(), name='cancel'),
]
