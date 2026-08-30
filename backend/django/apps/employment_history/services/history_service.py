from django.db import transaction

from ..models import EmploymentRecord, HistoryAccessLog


@transaction.atomic
def create_record(*, worker=None, employer=None, validated_data):
	if worker is not None and not worker.user.is_worker:
		raise PermissionError('Only workers can add personal employment history.')
	if employer is not None and not employer.user.is_employer:
		raise PermissionError('Only employers can add employment history on behalf of workers.')

	if employer is not None:
		worker_obj = worker
		if worker_obj is None:
			raise PermissionError('A worker is required to add employment history.')
		establishment = validated_data.get('establishment') or validated_data.get('establishment_id')
		if establishment is None:
			raise PermissionError('Please select an establishment for this work record.')
		if not employer.establishments.filter(pk=(establishment.pk if hasattr(establishment, 'pk') else establishment)).exists():
			raise PermissionError('You can only add employment history for one of your establishments.')
		payload = dict(validated_data)
		payload.pop('establishment_id', None)
		payload.pop('worker_id', None)
		payload['employer'] = employer
		payload['worker'] = worker_obj
		return EmploymentRecord.objects.create(**payload)

	if worker is None:
		raise PermissionError('A worker is required to add employment history.')
	return EmploymentRecord.objects.create(worker=worker, **validated_data)


@transaction.atomic
def update_record(*, record, validated_data):
	for field, value in validated_data.items():
		setattr(record, field, value)
	if record.verification_status != EmploymentRecord.VerificationStatus.PENDING:
		record.verification_status = EmploymentRecord.VerificationStatus.PENDING
		record.verified_at = None
		record.verified_by = ''
	record.verification_notes = ''
	record.save(update_fields=list(validated_data) + ['verification_status', 'verified_at', 'verified_by', 'verification_notes'])
	return record


def can_view_history(*, employer, worker):
	return bool(
		worker.consent_history_sharing
		and HistoryAccessLog.objects.filter(employer=employer, worker=worker).exists()
	)


@transaction.atomic
def create_unlock_transaction(*, employer, worker, amount_ksh):
	from apps.payments.models import Transaction

	if not employer.user.is_employer:
		raise PermissionError('Only employers can unlock employment history.')
	if not worker.consent_history_sharing:
		raise PermissionError('This worker has not consented to history sharing.')
	if HistoryAccessLog.objects.filter(employer=employer, worker=worker).exists():
		raise ValueError('This employer already has access to this worker history.')
	return Transaction.objects.create(
		employer=employer,
		transaction_type=Transaction.TransactionType.HISTORY_UNLOCK,
		amount_ksh=amount_ksh,
		metadata={'worker_id': worker.id},
	)


@transaction.atomic
def grant_history_access(*, transaction):
	from apps.audit.models import AuditLog

	if transaction.transaction_type != transaction.TransactionType.HISTORY_UNLOCK:
		raise ValueError('Transaction is not a history unlock.')
	if transaction.status != transaction.Status.COMPLETED:
		raise ValueError('History access requires a completed payment.')
	worker_id = transaction.metadata.get('worker_id')
	if not worker_id:
		raise ValueError('Transaction does not identify a worker.')
	log, _ = HistoryAccessLog.objects.get_or_create(
		employer=transaction.employer, worker_id=worker_id, defaults={'transaction': transaction}
	)
	if log.transaction_id == transaction.id:
		AuditLog.objects.get_or_create(
			actor=transaction.employer.user,
			action='history_unlocked',
			target_type='worker',
			target_id=str(worker_id),
			metadata={'transaction_id': transaction.id},
		)
	return log
