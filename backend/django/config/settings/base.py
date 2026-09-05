import os
from pathlib import Path

from dotenv import load_dotenv
from core.logging.config import LOGGING

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR.parent / '.env')
SECRET_KEY = os.getenv('SECRET_KEY', 'unsafe-development-key')
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
ALLOWED_HOSTS = [host.strip() for host in os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',') if host.strip()]

INSTALLED_APPS = [
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
	'django.contrib.postgres',
	'rest_framework',
	'corsheaders',
	'channels',
	'apps.accounts.apps.AccountsConfig',
	'apps.credits.apps.CreditsConfig',
	'apps.analytics.apps.AnalyticsConfig',
	'apps.audit.apps.AuditConfig',
	'apps.employment_history.apps.EmploymentHistoryConfig',
	'apps.establishments.apps.EstablishmentsConfig',
	'apps.fraud.apps.FraudConfig',
	'apps.job_applications.apps.JobApplicationsConfig',
	'apps.jobs.apps.JobsConfig',
	'apps.messaging.apps.MessagingConfig',
	'apps.notifications.apps.NotificationsConfig',
	'apps.payments.apps.PaymentsConfig',
	'apps.ratings.apps.RatingsConfig',
	'apps.subscriptions.apps.SubscriptionsConfig',
	'apps.support.apps.SupportConfig',
]

MIDDLEWARE = [
	'django.middleware.security.SecurityMiddleware',
	'corsheaders.middleware.CorsMiddleware',
	'apps.accounts.middleware.RequestIDMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'apps.credits.middleware.CreditsContextMiddleware',
	'apps.audit.middleware.AuditRequestMiddleware',
	'apps.analytics.middleware.AnalyticsContextMiddleware',
	'apps.notifications.middleware.NotificationCountMiddleware',
	'apps.payments.middleware.PaymentContextMiddleware',
	'apps.fraud.middleware.FraudContextMiddleware',
	'apps.subscriptions.middleware.SubscriptionContextMiddleware',
	'apps.support.middleware.SupportContextMiddleware',
	'apps.establishments.middleware.EstablishmentContextMiddleware',
	'apps.jobs.middleware.JobContextMiddleware',
	'apps.job_applications.middleware.ApplicationContextMiddleware',
	'apps.employment_history.middleware.EmploymentHistoryContextMiddleware',
	'apps.ratings.middleware.RatingsContextMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'DIRS': [BASE_DIR / 'templates'],
		'APP_DIRS': True,
		'OPTIONS': {
			'context_processors': [
				'django.template.context_processors.request',
				'django.contrib.auth.context_processors.auth',
				'django.contrib.messages.context_processors.messages',
			],
		},
	},
]

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.postgresql',
		'NAME': os.getenv('POSTGRES_DB', 'kazilink'),
		'USER': os.getenv('POSTGRES_USER', 'kazilink'),
		'PASSWORD': os.getenv('POSTGRES_PASSWORD', ''),
		'HOST': os.getenv('POSTGRES_HOST', 'localhost'),
		'PORT': os.getenv('POSTGRES_PORT', '5432'),
	}
}

AUTH_USER_MODEL = 'accounts.User'
AUTH_PASSWORD_VALIDATORS = []
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Nairobi'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
	'DEFAULT_AUTHENTICATION_CLASSES': (
		'rest_framework_simplejwt.authentication.JWTAuthentication',
	),
	'DEFAULT_PERMISSION_CLASSES': (
		'rest_framework.permissions.IsAuthenticated',
	),
	'EXCEPTION_HANDLER': 'core.exceptions.api_exception_handler',
	'DEFAULT_THROTTLE_CLASSES': (
		'rest_framework.throttling.AnonRateThrottle',
	),
	'DEFAULT_THROTTLE_RATES': {'anon': '100/hour'},
}

CORS_ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv('CORS_ALLOWED_ORIGINS', '').split(',') if origin.strip()]
CORS_ALLOW_ALL_ORIGINS = os.getenv('CORS_ALLOW_ALL_ORIGINS', 'false').lower() == 'true'
CORS_ALLOW_CREDENTIALS = os.getenv('CORS_ALLOW_CREDENTIALS', 'false').lower() == 'true'
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in os.getenv('CSRF_TRUSTED_ORIGINS', '').split(',') if origin.strip()]
CORS_ALLOW_HEADERS = [
	'accept',
	'authorization',
	'content-type',
	'user-agent',
	'x-csrftoken',
	'x-requested-with',
	'x-correlation-id',
	'x-request-id',
]
CORS_EXPOSE_HEADERS = ['X-Correlation-ID', 'X-Request-ID']
MPESA_SHORTCODE = os.getenv('MPESA_SHORTCODE', '')
MPESA_CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY', '')
MPESA_CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET', '')
MPESA_PASSKEY = os.getenv('MPESA_PASSKEY', '')
MPESA_BASE_URL = os.getenv('MPESA_BASE_URL', 'https://sandbox.safaricom.co.ke')
MPESA_CALLBACK_URL = os.getenv('MPESA_CALLBACK_URL', '')
MPESA_ENABLED = os.getenv('MPESA_ENABLED', 'false').lower() == 'true'
MPESA_API_TIMEOUT_SECONDS = int(os.getenv('MPESA_API_TIMEOUT_SECONDS', '15'))
MPESA_STK_MAX_RETRIES = int(os.getenv('MPESA_STK_MAX_RETRIES', '2'))
MPESA_STK_RETRY_BACKOFF_SECONDS = float(os.getenv('MPESA_STK_RETRY_BACKOFF_SECONDS', '3'))
MPESA_WEBHOOK_SECRET = os.getenv('MPESA_WEBHOOK_SECRET', '')
CREDIT_KSH_PER_CREDIT = int(os.getenv('CREDIT_KSH_PER_CREDIT', '20'))
REFERRAL_REFERRER_CREDITS = int(os.getenv('REFERRAL_REFERRER_CREDITS', '5'))
REFERRAL_REFERRED_CREDITS = int(os.getenv('REFERRAL_REFERRED_CREDITS', '2'))
FRAUD_PAYMENT_THRESHOLD_KSH = int(os.getenv('FRAUD_PAYMENT_THRESHOLD_KSH', '100000'))
AUDIT_LOG_RETENTION_DAYS = int(os.getenv('AUDIT_LOG_RETENTION_DAYS', '365'))
SMS_ENABLED = os.getenv('SMS_ENABLED', 'false').lower() == 'true'
SMS_API_BASE_URL = os.getenv('SMS_API_BASE_URL', 'https://sms.ots.co.ke/api/v3/')
SMS_API_SEND_PATH = os.getenv('SMS_API_SEND_PATH', 'sms/send')
SMS_API_TOKEN = os.getenv('SMS_API_TOKEN', '')
SMS_SENDER_ID = os.getenv('SMS_SENDER_ID', '')
SMS_API_TIMEOUT_SECONDS = int(os.getenv('SMS_API_TIMEOUT_SECONDS', '10'))
CHANNEL_LAYERS = {
	'default': {
		'BACKEND': 'channels_redis.core.RedisChannelLayer',
		'CONFIG': {'hosts': [os.getenv('REDIS_URL', 'redis://localhost:6379/0')]},
	}
}
CACHES = {
	'default': {
		'BACKEND': 'django.core.cache.backends.redis.RedisCache',
		'LOCATION': os.getenv('REDIS_URL', 'redis://localhost:6379/1'),
	}
}
