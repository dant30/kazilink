from django.apps import AppConfig

class AnalyticsConfig(AppConfig):
    name = 'apps.analytics'
    label = 'analytics'

    def ready(self):
        from . import signals  # noqa: F401
