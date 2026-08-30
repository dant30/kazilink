from django.db import transaction

from ..models import Transaction


@transaction.atomic
def refund_transaction(*, transaction_id):
	payment = Transaction.objects.select_for_update().get(pk=transaction_id)
	if payment.status != Transaction.Status.COMPLETED:
		raise ValueError('Only completed transactions can be refunded.')
	payment.status = Transaction.Status.REFUNDED
	payment.save(update_fields=('status',))
	return payment
