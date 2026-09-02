from django.urls import path

from ..views.worker_views import MyWorkerProfileView, WorkerDetailView, WorkerListView

app_name = 'workers'

urlpatterns = [
	path('me/', MyWorkerProfileView.as_view(), name='worker-me'),
	path('', WorkerListView.as_view(), name='worker-list'),
	path('<int:pk>/', WorkerDetailView.as_view(), name='worker-detail'),
]