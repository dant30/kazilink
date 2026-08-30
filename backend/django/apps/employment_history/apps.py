from django.apps import AppConfig


class EmploymentHistoryConfig(AppConfig):
    name = 'apps.employment_history'
    label = 'employment_history'

    def ready(self):
        from . import signals  # noqa: F401
