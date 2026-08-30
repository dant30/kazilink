from django.contrib import admin
from django.urls import include, path


urlpatterns = [
	path('admin/', admin.site.urls),
	path('api/accounts/', include('apps.accounts.urls')),
	path('api/jobs/', include('apps.jobs.urls')),
	path('api/applications/', include('apps.job_applications.urls')),
	path('api/notifications/', include('apps.notifications.urls')),
	path('api/fraud/', include('apps.fraud.urls')),
	path('api/subscriptions/', include('apps.subscriptions.urls')),
	path('api/support/', include('apps.support.urls')),
	path('api/establishments/', include('apps.establishments.urls')),
	path('api/employment-history/', include('apps.employment_history.urls')),
	path('api/ratings/', include('apps.ratings.urls')),
	path('api/messaging/', include('apps.messaging.urls')),
	path('api/payments/', include('apps.payments.urls')),
	path('api/audit/', include('apps.audit.urls')),
	path('api/analytics/', include('apps.analytics.urls')),
]
