from django.db import transaction

from apps.audit.models import AuditLog
from apps.credits.services import spend_credits

from ..models import HistoryAccessLog


@transaction.atomic
def unlock_history_with_credits(*, employer, worker, idempotency_key):
	if not employer.user.is_employer:
		raise PermissionError('Only employers can unlock employment history.')
	if not worker.consent_history_sharing:
		raise PermissionError('This worker has not consented to history sharing.')
	if HistoryAccessLog.objects.filter(employer=employer, worker=worker).exists():
		raise ValueError('This employer already has access to this worker history.')
	entry = spend_credits(
		user=employer.user,
		action='history_unlock',
		reference=f'worker:{worker.id}',
		idempotency_key=idempotency_key,
		metadata={'worker_id': worker.id},
	)
	log, _ = HistoryAccessLog.objects.get_or_create(
		employer=employer,
		worker=worker,
		defaults={'transaction': None},
	)
	AuditLog.objects.get_or_create(
		actor=employer.user,
		action='history_unlocked',
		target_type='worker',
		target_id=str(worker.id),
		metadata={'credit_entry_id': entry.id},
	)
	return log, entry
