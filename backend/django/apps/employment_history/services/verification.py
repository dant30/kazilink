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
