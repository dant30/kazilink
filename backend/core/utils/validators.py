import re
from decimal import Decimal
from pathlib import Path

from django.core.exceptions import ValidationError


KENYAN_MOBILE_PATTERN = re.compile(r'^(?:\+254|254|0)7\d{8}$')


def normalize_kenyan_phone(value):
	phone = str(value or '').replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
	if not KENYAN_MOBILE_PATTERN.fullmatch(phone):
		raise ValidationError('Enter a valid Kenyan mobile number.')
	if phone.startswith('+254'):
		return phone
	if phone.startswith('254'):
		return f'+{phone}'
	return f'+254{phone[1:]}'


def validate_kenyan_phone(value):
	return normalize_kenyan_phone(value)


def validate_password_strength(value):
	password = str(value or '')
	if len(password) < 8:
		raise ValidationError('Password must be at least 8 characters long.')
	if not re.search(r'[a-z]', password):
		raise ValidationError('Password must contain a lowercase letter.')
	if not re.search(r'[A-Z]', password):
		raise ValidationError('Password must contain an uppercase letter.')
	if not re.search(r'\d', password):
		raise ValidationError('Password must contain a number.')
	return password


def file_size_validator(max_bytes):
	if max_bytes <= 0:
		raise ValueError('max_bytes must be greater than zero.')

	def validate(uploaded_file):
		if uploaded_file is None:
			return
		if getattr(uploaded_file, 'size', 0) > max_bytes:
			raise ValidationError(f'File size must not exceed {max_bytes} bytes.')

	return validate


def file_extension_validator(allowed_extensions):
	extensions = {str(extension).lower().lstrip('.') for extension in allowed_extensions}
	if not extensions:
		raise ValueError('At least one file extension is required.')

	def validate(uploaded_file):
		if uploaded_file is None:
			return
		extension = Path(uploaded_file.name).suffix.lower().lstrip('.')
		if extension not in extensions:
			raise ValidationError(f'Allowed file types: {", ".join(sorted(extensions))}.')

	return validate


def validate_content_type(allowed_content_types):
	content_types = {str(content_type).lower() for content_type in allowed_content_types}
	if not content_types:
		raise ValueError('At least one content type is required.')

	def validate(uploaded_file):
		if uploaded_file is None:
			return
		content_type = str(getattr(uploaded_file, 'content_type', '')).lower()
		if content_type not in content_types:
			raise ValidationError(f'Allowed content types: {", ".join(sorted(content_types))}.')

	return validate


def positive_amount_validator(value):
	try:
		amount = Decimal(str(value))
	except (TypeError, ValueError):
		raise ValidationError('Enter a valid amount.')
	if amount <= 0:
		raise ValidationError('Amount must be greater than zero.')
	return value
