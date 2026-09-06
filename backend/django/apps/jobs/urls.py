from django.urls import path

from .views.admin_views import JobAdminListView
from .views.api_views import CloseJobView, CreditFeatureJobView, CreditBoostJobView, JobDetailView, JobListCreateView, RecommendedJobsView, SavedJobListView, SavedJobView

app_name = 'jobs'

urlpatterns = [
	path('', JobListCreateView.as_view(), name='job-list-create'),
	path('recommended/', RecommendedJobsView.as_view(), name='recommended-jobs'),
	path('saved/', SavedJobListView.as_view(), name='saved-jobs'),
	path('admin/list/', JobAdminListView.as_view(), name='job-admin-list'),
	path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
	path('<int:pk>/save/', SavedJobView.as_view(), name='job-save'),
	path('<int:pk>/close/', CloseJobView.as_view(), name='job-close'),
	path('<int:pk>/credits/feature/', CreditFeatureJobView.as_view(), name='job-credit-feature'),
	path('<int:pk>/credits/boost/', CreditBoostJobView.as_view(), name='job-credit-boost'),
]
