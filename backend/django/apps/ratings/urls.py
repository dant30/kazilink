from django.urls import path

from .views.admin_views import ReviewAdminListView
from .views.api_views import ReviewDetailView, ReviewListCreateView

app_name = 'ratings'

urlpatterns = [
	path('', ReviewListCreateView.as_view(), name='review-list-create'),
	path('admin/list/', ReviewAdminListView.as_view(), name='review-admin-list'),
	path('<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
]
