from django.apps import AppConfig


class RatingsConfig(AppConfig):
    name = 'apps.ratings'
    label = 'ratings'

    def ready(self):
        from . import signals  # noqa: F401
