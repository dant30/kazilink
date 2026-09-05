from django.db import transaction
from django.utils import timezone

from ..models import CreditLedgerEntry, CreditWallet
from .catalog import credit_cost


@transaction.atomic
def get_or_create_wallet(*, user):
	wallet, _ = CreditWallet.objects.select_for_update().get_or_create(user=user)
	return wallet


@transaction.atomic
def record_ledger_entry(*, wallet, amount, entry_type, action='', reference='', idempotency_key='', metadata=None):
	if amount == 0:
		raise ValueError('A credit ledger entry cannot be zero.')
	if idempotency_key:
		existing = CreditLedgerEntry.objects.filter(wallet=wallet, idempotency_key=idempotency_key).first()
		if existing:
			return existing
	wallet = CreditWallet.objects.select_for_update().get(pk=wallet.pk)
	balance_before = wallet.balance
	balance_after = balance_before + amount
	if balance_after < 0:
		raise ValueError('Insufficient Kazi Credits.')
	wallet.balance = balance_after
	wallet.save(update_fields=('balance', 'updated_at'))
	return CreditLedgerEntry.objects.create(
		wallet=wallet,
		entry_type=entry_type,
		amount=amount,
		balance_before=balance_before,
		balance_after=balance_after,
		action=action,
		reference=reference,
		idempotency_key=idempotency_key,
		metadata=metadata or {},
		created_at=timezone.now(),
	)


@transaction.atomic
def spend_credits(*, user, action, reference='', idempotency_key='', metadata=None):
	cost = credit_cost(action, user)
	wallet = get_or_create_wallet(user=user)
	entry = record_ledger_entry(
		wallet=wallet,
		amount=-cost,
		entry_type=CreditLedgerEntry.EntryType.SPEND,
		action=action,
		reference=reference,
		idempotency_key=idempotency_key,
		metadata=metadata,
	)
	return entry
