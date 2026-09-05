from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from ..views.admin_views import ReferralAdminListView, UserListView
from ..views.api_views import LoginView, MeView, PasswordResetConfirmView, PasswordResetRequestView, PasswordResetVerifyView, ProfileView, RegisterView, VerifyPhoneView
from ..views.referral_views import ReferralSummaryView
from ..views.occupation_views import WorkerOccupationListView
from ..views.employer_views import MyEmployerProfileView

app_name = 'accounts'

urlpatterns = [
	path('register/', RegisterView.as_view(), name='register'),
	path('login/', LoginView.as_view(), name='login'),
	path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
	path('verify-phone/', VerifyPhoneView.as_view(), name='verify-phone'),
	path('password-reset/request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
	path('password-reset/verify/', PasswordResetVerifyView.as_view(), name='password-reset-verify'),
	path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
	path('me/', MeView.as_view(), name='me'),
	path('profile/', ProfileView.as_view(), name='profile'),
	path('employer-profile/', MyEmployerProfileView.as_view(), name='employer-profile'),
	path('referrals/', ReferralSummaryView.as_view(), name='referral-summary'),
	path('worker-occupations/', WorkerOccupationListView.as_view(), name='worker-occupations'),
	path('admin/users/', UserListView.as_view(), name='admin-user-list'),
	path('admin/referrals/', ReferralAdminListView.as_view(), name='admin-referral-list'),
]