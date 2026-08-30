from django.apps import AppConfig


class JobsConfig(AppConfig):
    name = 'apps.jobs'
    label = 'jobs'

    def ready(self):
        from . import signals  # noqa: F401
