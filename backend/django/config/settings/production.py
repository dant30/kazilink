from .base import *
from django.core.exceptions import ImproperlyConfigured

DEBUG = False

if len(SECRET_KEY) < 50 or len(set(SECRET_KEY)) < 5 or SECRET_KEY.startswith('django-insecure-'):
	raise ImproperlyConfigured('SECRET_KEY must be at least 50 characters and must not use a django-insecure value in production.')

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
