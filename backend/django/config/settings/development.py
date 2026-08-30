import os

from .base import *

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
CORS_ALLOW_ALL_ORIGINS = True

# Use a secure secret key for development (minimum 32 bytes for JWT)
SECRET_KEY = os.getenv(
    'SECRET_KEY',
    'django-insecure-development-key-minimum-32-bytes-long-for-jwt-sha256'
)

# Use in-memory cache for development instead of Redis
CACHES = {
	'default': {
		'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
		'LOCATION': 'unique-snowflake',
	}
}

# Use in-memory channel layer for development
CHANNEL_LAYERS = {
	'default': {
		'BACKEND': 'channels.layers.InMemoryChannelLayer',
	}
}
