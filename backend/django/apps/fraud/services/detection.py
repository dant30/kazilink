from django.db import transaction
from django.utils import timezone

from ..models import FraudAlert


@transaction.atomic
def create_alert(*, target_type, target_id, target_name, reason, severity, details):
	return FraudAlert.objects.create(
		target_type=target_type,
		target_id=str(target_id),
		target_name=target_name,
		reason=reason,
		severity=severity,
		details=details,
	)


@transaction.atomic
def resolve_alert(*, alert, status, user):
	if status not in (FraudAlert.Status.RESOLVED, FraudAlert.Status.DISMISSED):
		raise ValueError('Fraud alerts can only be resolved or dismissed.')
	if alert.status != FraudAlert.Status.PENDING:
		return alert
	alert.status = status
	alert.resolved_at = timezone.now()
	alert.resolved_by = user
	alert.save(update_fields=('status', 'resolved_at', 'resolved_by'))
	return alert


def scan_transaction(payment):
	"""Create a high-severity alert for unusually large payments."""
	from django.conf import settings

	threshold = getattr(settings, 'FRAUD_PAYMENT_THRESHOLD_KSH', 100000)
	if payment.amount_ksh <= threshold:
		return None
	return create_alert(
		target_type='transaction',
		target_id=payment.id,
		target_name=str(payment.employer),
		reason='Large payment amount',
		severity=FraudAlert.Severity.HIGH,
		details=f'Transaction amount KSh {payment.amount_ksh} exceeds the configured threshold of KSh {threshold}.',
	)
