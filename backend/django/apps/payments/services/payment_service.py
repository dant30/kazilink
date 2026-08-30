from django.db import transaction
from django.utils import timezone

from ..models import Transaction


def get_transaction_for_update(*, transaction_id):
	return Transaction.objects.select_for_update().select_related('employer__user').get(pk=transaction_id)


@transaction.atomic
def create_pending_payment(*, employer, transaction_type, amount_ksh, metadata=None):
	return Transaction.objects.create(
		employer=employer,
		transaction_type=transaction_type,
		amount_ksh=amount_ksh,
		metadata=metadata or {},
	)


@transaction.atomic
def complete_payment(*, transaction_id, provider_reference='', metadata=None):
	payment = get_transaction_for_update(transaction_id=transaction_id)
	if payment.status == Transaction.Status.REFUNDED:
		raise ValueError('A refunded transaction cannot be completed.')
	if payment.status == Transaction.Status.COMPLETED:
		return payment
	payment.status = Transaction.Status.COMPLETED
	payment.provider_reference = provider_reference or payment.provider_reference
	payment.completed_at = timezone.now()
	if metadata:
		payment.metadata = {**payment.metadata, **metadata}
	payment.save(update_fields=('status', 'provider_reference', 'completed_at', 'metadata'))
	return payment


@transaction.atomic
def fail_payment(*, transaction_id, provider_reference='', metadata=None):
	payment = get_transaction_for_update(transaction_id=transaction_id)
	if payment.status in (Transaction.Status.COMPLETED, Transaction.Status.REFUNDED):
		return payment
	payment.status = Transaction.Status.FAILED
	payment.provider_reference = provider_reference or payment.provider_reference
	if metadata:
		payment.metadata = {**payment.metadata, **metadata}
	payment.save(update_fields=('status', 'provider_reference', 'metadata'))
	return payment
