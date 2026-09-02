from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from ..views.admin_views import UserListView
from ..views.api_views import LoginView, MeView, ProfileView, RegisterView, VerifyPhoneView
from ..views.employer_views import MyEmployerProfileView

app_name = 'accounts'

urlpatterns = [
	path('register/', RegisterView.as_view(), name='register'),
	path('login/', LoginView.as_view(), name='login'),
	path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
	path('verify-phone/', VerifyPhoneView.as_view(), name='verify-phone'),
	path('me/', MeView.as_view(), name='me'),
	path('profile/', ProfileView.as_view(), name='profile'),
	path('employer-profile/', MyEmployerProfileView.as_view(), name='employer-profile'),
	path('admin/users/', UserListView.as_view(), name='admin-user-list'),
]