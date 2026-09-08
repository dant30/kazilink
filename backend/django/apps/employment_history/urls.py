from django.urls import path

from .views.admin_views import EmploymentReferenceAttemptView, EmploymentVerificationQueueView, EmploymentVerificationView
from .views.api_views import (
	EmployerHistoryAccessView,
	HistoryConsentView,
	RevokeHistoryAccessView,
	MyHistoryAccessView,
	UnlockHistoryView,
	WorkerHistoryDetailView,
	WorkerHistoryListCreateView,
)

app_name = 'employment_history'

urlpatterns = [
	path('mine/', WorkerHistoryListCreateView.as_view(), name='worker-history-list-create'),
	path('mine/<int:pk>/', WorkerHistoryDetailView.as_view(), name='worker-history-detail'),
	path('unlock/', UnlockHistoryView.as_view(), name='unlock-history'),
	path('access/', MyHistoryAccessView.as_view(), name='history-access-list'),
	path('consent/', HistoryConsentView.as_view(), name='history-consent'),
	path('access/revoke/', RevokeHistoryAccessView.as_view(), name='history-access-revoke'),
	path('worker/<int:worker_id>/', EmployerHistoryAccessView.as_view(), name='employer-history-access'),
	path('admin/verification-queue/', EmploymentVerificationQueueView.as_view(), name='verification-queue'),
	path('admin/<int:pk>/verify/', EmploymentVerificationView.as_view(), name='verify-employment-record'),
	path('admin/<int:pk>/reference/', EmploymentReferenceAttemptView.as_view(), name='reference-attempt'),
]
