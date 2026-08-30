from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.notifications.models import Notification

from .models import Message


@receiver(post_save, sender=Message)
def notify_message_recipient(sender, instance, created, **kwargs):
	if not created:
		return
	recipient = instance.conversation.employer.user if instance.sender_id == instance.conversation.worker.user_id else instance.conversation.worker.user
	Notification.objects.create(
		user=recipient,
		title='New message',
		message=f'{instance.sender.full_name} sent you a message.',
		notification_type='message',
		link_tab='chat',
	)
