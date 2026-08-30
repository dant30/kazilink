from ..models import KPISnapshot


def latest_snapshot():
	return KPISnapshot.objects.order_by('-period_end', '-created_at').first()


def snapshots_for_period(*, period_start=None, period_end=None):
	queryset = KPISnapshot.objects.all()
	if period_start:
		queryset = queryset.filter(period_end__gte=period_start)
	if period_end:
		queryset = queryset.filter(period_start__lte=period_end)
	return queryset
