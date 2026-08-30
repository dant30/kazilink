from django.contrib.auth import get_user_model
from django.db import transaction

from ..models import SupportTicket

User = get_user_model()


@transaction.atomic
def create_ticket(*, user, subject, description):
	return SupportTicket.objects.create(user=user, subject=subject.strip(), description=description.strip())


@transaction.atomic
def update_ticket(*, ticket, status=None, assigned_to_id=None):
	if status is not None:
		ticket.status = status
	if assigned_to_id is not None:
		ticket.assigned_to = User.objects.get(pk=assigned_to_id) if assigned_to_id else None
	ticket.save(update_fields=('status', 'assigned_to', 'updated_at'))
	return ticket


@transaction.atomic
def assign_ticket(*, ticket, assignee):
	if not assignee.is_staff:
		raise PermissionError('Only staff users can be assigned support tickets.')
	ticket.assigned_to = assignee
	if ticket.status == SupportTicket.Status.OPEN:
		ticket.status = SupportTicket.Status.IN_PROGRESS
	ticket.save(update_fields=('assigned_to', 'status', 'updated_at'))
	return ticket
