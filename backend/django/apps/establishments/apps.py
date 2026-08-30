from django.apps import AppConfig


class EstablishmentsConfig(AppConfig):
    name = 'apps.establishments'
    label = 'establishments'

    def ready(self):
        from . import signals  # noqa: F401
