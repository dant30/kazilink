from django.apps import AppConfig

class SubscriptionsConfig(AppConfig):
    name = 'apps.subscriptions'
    label = 'subscriptions'

    def ready(self):
        from . import signals  # noqa: F401
