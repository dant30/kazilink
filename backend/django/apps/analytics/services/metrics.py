from datetime import datetime, time
from decimal import Decimal

from django.db.models import Sum
from django.utils import timezone

from ..models import KPISnapshot


def _bounds(period_start, period_end):
	return timezone.make_aware(datetime.combine(period_start, time.min)), timezone.make_aware(datetime.combine(period_end, time.max))


def _rate(numerator, denominator):
	return (Decimal(numerator) * 100 / Decimal(denominator)).quantize(Decimal('0.01')) if denominator else Decimal('0.00')


def build_kpi_snapshot(*, period_start, period_end):
	from apps.accounts.models import EmployerProfile, User
	from apps.job_applications.models import JobApplication
	from apps.jobs.models import Job
	from apps.payments.models import Transaction

	start, end = _bounds(period_start, period_end)
	workers = User.objects.filter(is_worker=True, joined_date__range=(start, end)).count()
	employers = EmployerProfile.objects.filter(user__is_employer=True, user__is_active=True).count()
	jobs = Job.objects.filter(posted_date__range=(start, end)).count()
	applications = JobApplication.objects.filter(applied_date__range=(start, end)).count()
	hires = JobApplication.objects.filter(status=JobApplication.Status.HIRED, applied_date__range=(start, end)).count()
	paid = Transaction.objects.filter(status=Transaction.Status.COMPLETED, transaction_type=Transaction.TransactionType.HISTORY_UNLOCK, completed_at__range=(start, end)).count()
	completed = Transaction.objects.filter(status=Transaction.Status.COMPLETED, completed_at__range=(start, end))
	revenue = completed.aggregate(total=Sum('amount_ksh'))['total'] or 0
	payers = completed.values('employer_id').distinct().count()
	return KPISnapshot.objects.update_or_create(
		period_start=period_start,
		period_end=period_end,
		defaults={
			'registered_workers': workers,
			'active_employers': employers,
			'jobs_posted': jobs,
			'applications': applications,
			'successful_hires': hires,
			'paid_unlocks': paid,
			'premium_purchase_rate': _rate(completed.filter(transaction_type=Transaction.TransactionType.SUBSCRIPTION).values('employer_id').distinct().count(), employers),
			'average_revenue_per_paying_employer_ksh': Decimal(revenue) / Decimal(payers) if payers else Decimal('0.00'),
			'repeat_employer_rate': Decimal('0.00'),
			'customer_acquisition_cost_ksh': Decimal('0.00'),
		},
	)[0]
