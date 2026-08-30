from django.apps import AppConfig


class MessagingConfig(AppConfig):
    name = 'apps.messaging'
    label = 'messaging'

    def ready(self):
        from . import signals  # noqa: F401
