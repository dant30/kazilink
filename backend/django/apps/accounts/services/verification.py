from django.db import transaction
from django.utils import timezone

from core.authentication.otp import verify_otp

from ..models import PhoneVerification, User
from .referrals import reward_referral


@transaction.atomic
def verify_phone(*, phone, code):
	verification = (
		PhoneVerification.objects.select_for_update()
		.filter(user__phone=phone, verified_at__isnull=True)
		.order_by('-created_at')
		.first()
	)
	if verification is None:
		raise ValueError('No pending phone verification was found.')
	if verification.is_expired:
		raise ValueError('The verification code has expired.')
	if verification.attempts >= 5:
		raise ValueError('Too many invalid verification attempts. Request a new code.')
	verification.attempts += 1
	if not verify_otp(code, verification.code_hash):
		verification.save(update_fields=['attempts'])
		raise ValueError('The verification code is invalid.')
	verification.verified_at = timezone.now()
	verification.save(update_fields=['attempts', 'verified_at'])
	user = verification.user
	user.is_phone_verified = True
	user.save(update_fields=['is_phone_verified'])
	reward_referral(user=user)
	return user
