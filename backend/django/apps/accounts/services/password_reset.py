from datetime import timedelta
import secrets

from django.db import transaction
from django.utils import timezone

from core.authentication.otp import generate_otp, hash_otp, verify_otp
from core.services.sms import send_sms

from ..models import PasswordResetVerification, User


RESET_CODE_LIFETIME = timedelta(minutes=10)
RESET_TOKEN_LIFETIME = timedelta(minutes=15)


def request_password_reset(*, phone: str) -> str | None:
	user = User.objects.filter(phone=phone).first()
	if not user:
		return None

	code = generate_otp()
	with transaction.atomic():
		PasswordResetVerification.objects.filter(user=user, verified_at__isnull=True).delete()
		PasswordResetVerification.objects.create(
			user=user,
			code_hash=hash_otp(code),
			expires_at=timezone.now() + RESET_CODE_LIFETIME,
		)
	send_sms(recipient=phone, message=f'Your KaziLink password reset code is {code}. It expires in 10 minutes.')
	return code


@transaction.atomic
def verify_password_reset(*, phone: str, code: str) -> str:
	verification = (
		PasswordResetVerification.objects.select_for_update()
		.filter(user__phone=phone, verified_at__isnull=True)
		.order_by('-created_at')
		.first()
	)
	if verification is None or verification.is_expired:
		raise ValueError('No valid password reset code was found.')
	if verification.attempts >= 5:
		raise ValueError('Too many invalid attempts. Request a new code.')

	verification.attempts += 1
	if not verify_otp(code, verification.code_hash):
		verification.save(update_fields=['attempts'])
		raise ValueError('The password reset code is invalid.')

	token = secrets.token_urlsafe(32)
	verification.verified_at = timezone.now()
	verification.reset_token_hash = hash_otp(token)
	verification.reset_token_expires_at = timezone.now() + RESET_TOKEN_LIFETIME
	verification.save(update_fields=['attempts', 'verified_at', 'reset_token_hash', 'reset_token_expires_at'])
	return token


@transaction.atomic
def reset_password(*, phone: str, reset_token: str, new_password: str) -> User:
	verification = (
		PasswordResetVerification.objects.select_for_update()
		.filter(user__phone=phone, verified_at__isnull=False)
		.order_by('-created_at')
		.first()
	)
	if verification is None or not verification.reset_token_is_valid or not secrets.compare_digest(hash_otp(reset_token), verification.reset_token_hash):
		raise ValueError('The password reset session is invalid or expired.')

	user = verification.user
	user.set_password(new_password)
	user.save(update_fields=['password'])
	verification.reset_token_expires_at = timezone.now()
	verification.save(update_fields=['reset_token_expires_at'])
	return user
