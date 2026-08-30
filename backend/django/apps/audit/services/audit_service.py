from django.db import transaction

from ..models import AuditLog


@transaction.atomic
def create_audit_log(*, action, target_type, target_id, actor=None, metadata=None):
	return AuditLog.objects.create(
		actor=actor,
		action=action,
		target_type=target_type,
		target_id=str(target_id),
		metadata=metadata or {},
	)


def audit_logs_for_target(*, target_type, target_id):
	return AuditLog.objects.select_related('actor').filter(target_type=target_type, target_id=str(target_id))