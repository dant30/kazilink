import secrets
import string

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.credits.models import CreditLedgerEntry
from apps.credits.services.wallet_service import get_or_create_wallet, record_ledger_entry

from ..models import Referral, ReferralCode, User


CODE_ALPHABET = string.ascii_uppercase + string.digits


def _new_code():
	return 'KAZI-' + ''.join(secrets.choice(CODE_ALPHABET) for _ in range(8))


@transaction.atomic
def ensure_referral_code(*, user):
	referral_code = ReferralCode.objects.filter(owner=user).first()
	if referral_code:
		return referral_code.code
	code = _new_code()
	while ReferralCode.objects.filter(code=code).exists():
		code = _new_code()
	ReferralCode.objects.create(owner=user, code=code)
	return code


def resolve_referral_code(*, code, referred_user):
	if not code:
		return None
	owner_record = ReferralCode.objects.filter(code=code.strip().upper()).select_related('owner').first()
	if owner_record is None or owner_record.owner_id == referred_user.pk:
		raise ValueError('The referral code is invalid.')
	referrer = owner_record.owner
	return Referral.objects.create(
		referrer=referrer,
		referred=referred_user,
		code=owner_record,
		referrer_reward=int(getattr(settings, 'REFERRAL_REFERRER_CREDITS', 5)),
		referred_reward=int(getattr(settings, 'REFERRAL_REFERRED_CREDITS', 2)),
	)


@transaction.atomic
def reward_referral(*, user):
	referral = Referral.objects.select_for_update().select_related('referrer', 'referred').filter(referred=user).first()
	if referral is None or referral.status != Referral.Status.PENDING:
		return referral
	referrer_wallet = get_or_create_wallet(user=referral.referrer)
	referred_wallet = get_or_create_wallet(user=referral.referred)
	record_ledger_entry(
		wallet=referrer_wallet,
		amount=referral.referrer_reward,
		entry_type=CreditLedgerEntry.EntryType.PROMOTION,
		action='referral_reward',
		reference=str(referral.id),
		idempotency_key=f'referral:{referral.id}:referrer',
		metadata={'referred_user_id': referral.referred_id},
	)
	record_ledger_entry(
		wallet=referred_wallet,
		amount=referral.referred_reward,
		entry_type=CreditLedgerEntry.EntryType.PROMOTION,
		action='referral_welcome_reward',
		reference=str(referral.id),
		idempotency_key=f'referral:{referral.id}:referred',
		metadata={'referrer_user_id': referral.referrer_id},
	)
	referral.status = Referral.Status.REWARDED
	referral.rewarded_at = timezone.now()
	referral.save(update_fields=('status', 'rewarded_at'))
	return referral
