from django.db import transaction

from ..models import CreditLedgerEntry
from .wallet_service import get_or_create_wallet, record_ledger_entry


@transaction.atomic
def transfer_credits(*, sender, recipient, amount, idempotency_key):
	if amount <= 0:
		raise ValueError('Transfer amount must be greater than zero.')
	if sender.pk == recipient.pk:
		raise ValueError('You cannot transfer credits to yourself.')
	if not recipient.is_active:
		raise ValueError('The recipient account is not active.')
	sender_wallet = get_or_create_wallet(user=sender)
	recipient_wallet = get_or_create_wallet(user=recipient)
	transfer_key = f'transfer:{idempotency_key}'
	existing = CreditLedgerEntry.objects.filter(wallet=sender_wallet, idempotency_key=transfer_key).first()
	if existing:
		return existing
	sent = record_ledger_entry(
		wallet=sender_wallet,
		amount=-amount,
		entry_type=CreditLedgerEntry.EntryType.SPEND,
		action='credit_transfer_sent',
		reference=str(recipient.pk),
		idempotency_key=transfer_key,
		metadata={'recipient_user_id': recipient.pk},
	)
	record_ledger_entry(
		wallet=recipient_wallet,
		amount=amount,
		entry_type=CreditLedgerEntry.EntryType.PROMOTION,
		action='credit_transfer_received',
		reference=str(sender.pk),
		idempotency_key=f'{transfer_key}:received',
		metadata={'sender_user_id': sender.pk},
	)
	return sent
