from django.db import transaction
from django.utils import timezone

from ..models import CreditLedgerEntry, CreditRecharge
from .wallet_service import record_ledger_entry


@transaction.atomic
def complete_recharge(*, provider_reference, metadata=None):
	recharge = CreditRecharge.objects.select_for_update().select_related('wallet').get(provider_reference=provider_reference)
	if recharge.status == CreditRecharge.Status.COMPLETED:
		return recharge
	if recharge.status == CreditRecharge.Status.FAILED:
		raise ValueError('A failed recharge cannot be completed.')
	recharge.status = CreditRecharge.Status.COMPLETED
	recharge.completed_at = timezone.now()
	if metadata:
		recharge.metadata = {**recharge.metadata, **metadata}
	recharge.save(update_fields=('status', 'completed_at', 'metadata'))
	record_ledger_entry(
		wallet=recharge.wallet,
		amount=recharge.credits,
		entry_type=CreditLedgerEntry.EntryType.RECHARGE,
		action='recharge',
		reference=str(recharge.id),
		idempotency_key=f'recharge:{recharge.id}',
		metadata={'provider_reference': provider_reference, 'amount_ksh': recharge.amount_ksh},
	)
	return recharge


@transaction.atomic
def fail_recharge(*, provider_reference, metadata=None):
	recharge = CreditRecharge.objects.select_for_update().get(provider_reference=provider_reference)
	if recharge.status == CreditRecharge.Status.COMPLETED:
		return recharge
	recharge.status = CreditRecharge.Status.FAILED
	if metadata:
		recharge.metadata = {**recharge.metadata, **metadata}
	recharge.save(update_fields=('status', 'metadata'))
	return recharge
