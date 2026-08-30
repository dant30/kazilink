from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from .services import build_kpi_snapshot


@shared_task
def generate_daily_kpi_snapshot():
	yesterday = timezone.localdate() - timedelta(days=1)
	return build_kpi_snapshot(period_start=yesterday, period_end=yesterday).pk
