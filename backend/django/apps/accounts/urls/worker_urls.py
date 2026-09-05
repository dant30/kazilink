from django.urls import path

from ..views.worker_views import CreditProfileBoostView, MyWorkerProfileView, WorkerDetailView, WorkerListView

app_name = 'workers'

urlpatterns = [
	path('me/', MyWorkerProfileView.as_view(), name='worker-me'),
	path('me/credits/boost/', CreditProfileBoostView.as_view(), name='worker-credit-boost'),
	path('', WorkerListView.as_view(), name='worker-list'),
	path('<int:pk>/', WorkerDetailView.as_view(), name='worker-detail'),
]