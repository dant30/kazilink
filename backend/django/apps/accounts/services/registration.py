from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from core.authentication.otp import generate_otp, hash_otp
from core.services.sms import send_sms

from ..models import EmployerProfile, PhoneVerification, User, UserRole, WorkerProfile
from apps.notifications.services import create_notification
from .referrals import resolve_referral_code


@transaction.atomic
def register_user(*, phone, full_name, password, role, email='', primary_role='', location='', availability='immediate', expected_daily_rate_ksh=0, bio='', contact_person='', referral_code='', terms_accepted=False, privacy_policy_accepted=False):
	if User.objects.filter(phone=phone).exists():
		raise ValueError('An account with this phone number already exists.')
	if role == UserRole.Role.WORKER and not primary_role:
		raise ValueError('primary_role is required for worker registration.')
	if role == UserRole.Role.EMPLOYER and not contact_person:
		raise ValueError('contact_person is required for employer registration.')
	if not terms_accepted or not privacy_policy_accepted:
		raise ValueError('Terms of Service and Privacy Policy acceptance are required.')
	consent_time = timezone.now()

	user = User.objects.create_user(
		phone=phone,
		full_name=full_name,
		password=password,
		email=email,
		is_worker=role == UserRole.Role.WORKER,
		is_employer=role == UserRole.Role.EMPLOYER,
		terms_accepted_at=consent_time,
		privacy_policy_accepted_at=consent_time,
		terms_version='2026-09',
		privacy_policy_version='2026-09',
	)
	UserRole.objects.create(user=user, role=role)
	if role == UserRole.Role.WORKER:
		WorkerProfile.objects.create(
			user=user,
			primary_role=primary_role,
			location=location,
			availability=availability,
			expected_daily_rate_ksh=expected_daily_rate_ksh,
			bio=bio,
		)
	else:
		EmployerProfile.objects.create(user=user, contact_person=contact_person)
	create_notification(
		user=user,
		title='Welcome to KaziLink',
		message='Your account is ready. Complete your profile to get better work or hiring matches.',
		notification_type='welcome',
		link_tab='profile',
	)
	if referral_code:
		resolve_referral_code(code=referral_code, referred_user=user)

	code = generate_otp()
	PhoneVerification.objects.create(
		user=user,
		code_hash=hash_otp(code),
		expires_at=timezone.now() + timedelta(minutes=10),
	)
	send_sms(
		recipient=phone,
		message=f'Your KaziLink verification code is {code}. It expires in 10 minutes.',
	)
	return user, code
