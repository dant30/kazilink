from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from core.authentication.otp import generate_otp, hash_otp

from ..models import EmployerProfile, PhoneVerification, User, UserRole, WorkerProfile


@transaction.atomic
def register_user(*, phone, full_name, password, role, email='', primary_role='', location='', availability='immediate', expected_daily_rate_ksh=0, bio='', contact_person=''):
	if User.objects.filter(phone=phone).exists():
		raise ValueError('An account with this phone number already exists.')
	if role == UserRole.Role.WORKER and not primary_role:
		raise ValueError('primary_role is required for worker registration.')
	if role == UserRole.Role.EMPLOYER and not contact_person:
		raise ValueError('contact_person is required for employer registration.')

	user = User.objects.create_user(
		phone=phone,
		full_name=full_name,
		password=password,
		email=email,
		is_worker=role == UserRole.Role.WORKER,
		is_employer=role == UserRole.Role.EMPLOYER,
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

	code = generate_otp()
	PhoneVerification.objects.create(
		user=user,
		code_hash=hash_otp(code),
		expires_at=timezone.now() + timedelta(minutes=10),
	)
	return user, code
