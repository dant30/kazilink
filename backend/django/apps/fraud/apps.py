from django.apps import AppConfig

class FraudConfig(AppConfig):
    name = 'apps.fraud'
    label = 'fraud'

    def ready(self):
        from . import signals  # noqa: F401
