from django.apps import AppConfig


class JobApplicationsConfig(AppConfig):
    name = 'apps.job_applications'
    label = 'job_applications'

    def ready(self):
        from . import signals  # noqa: F401
