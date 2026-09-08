from django.db import transaction
from django.utils import timezone

from ..models import EmploymentRecord


@transaction.atomic
def review_record(*, record, status, notes='', reviewer=''):
	if status not in (EmploymentRecord.VerificationStatus.VERIFIED, EmploymentRecord.VerificationStatus.REJECTED):
		raise ValueError('Invalid verification status.')
	record.verification_status = status
	record.verification_notes = notes
	record.verified_by = reviewer
	record.verified_at = timezone.now()
	record.save(update_fields=['verification_status', 'verification_notes', 'verified_by', 'verified_at'])
	return record


@transaction.atomic
def record_reference_attempt(*, record, status, reviewer='', next_attempt_at=None, notes=''):
	if status not in EmploymentRecord.ReferenceVerificationStatus.values:
		raise ValueError('Invalid reference verification status.')
	record.reference_verification_status = status
	record.reference_verification_attempts += 1
	record.reference_last_attempt_at = timezone.now()
	record.reference_next_attempt_at = next_attempt_at
	record.reference_verified_by = reviewer
	if status == EmploymentRecord.ReferenceVerificationStatus.VERIFIED:
		record.reference_verified_at = timezone.now()
	else:
		record.reference_verified_at = None
	if notes:
		record.verification_notes = notes
	update_fields = [
		'reference_verification_status', 'reference_verification_attempts', 'reference_last_attempt_at',
		'reference_next_attempt_at', 'reference_verified_at', 'reference_verified_by', 'verification_notes',
	]
	record.save(update_fields=update_fields)
	return record
