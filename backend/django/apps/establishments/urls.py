from django.urls import path

from .views.admin_views import EstablishmentAdminListView
from .views.api_views import EstablishmentDetailView, EstablishmentListCreateView, VerifyEstablishmentView
from .views.employer_views import MyEstablishmentListView

app_name = 'establishments'

urlpatterns = [
	path('mine/', MyEstablishmentListView.as_view(), name='establishment-mine'),
	path('', EstablishmentListCreateView.as_view(), name='establishment-list-create'),
	path('<int:pk>/', EstablishmentDetailView.as_view(), name='establishment-detail'),
	path('<int:pk>/verify/', VerifyEstablishmentView.as_view(), name='establishment-verify'),
	path('admin/list/', EstablishmentAdminListView.as_view(), name='establishment-admin-list'),
]
