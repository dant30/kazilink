from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .models import SupportTicket


@receiver(pre_save, sender=SupportTicket)
def capture_previous_ticket_state(sender, instance, **kwargs):
	if instance.pk:
		previous = sender.objects.filter(pk=instance.pk).values('status', 'assigned_to_id').first()
		instance._previous_status = previous['status'] if previous else None
		instance._previous_assigned_to_id = previous['assigned_to_id'] if previous else None


@receiver(post_save, sender=SupportTicket)
def notify_ticket_changes(sender, instance, created, **kwargs):
	from apps.notifications.services import create_notification

	if created:
		return
	previous_status = getattr(instance, '_previous_status', None)
	previous_assignee = getattr(instance, '_previous_assigned_to_id', None)
	recipients = []
	if previous_status != instance.status:
		recipients.append(instance.user)
	if instance.assigned_to_id and previous_assignee != instance.assigned_to_id:
		recipients.append(instance.assigned_to)
	for recipient in {user.id: user for user in recipients}.values():
		create_notification(
			user=recipient,
			title='Support ticket updated',
			message=f'Ticket #{instance.id} is now {instance.get_status_display().lower()}.',
			notification_type='support',
			link_tab='support',
		)
