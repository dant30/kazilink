from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .models import Transaction


@receiver(pre_save, sender=Transaction)
def capture_previous_status(sender, instance, **kwargs):
	if instance.pk:
		instance._previous_status = sender.objects.filter(pk=instance.pk).values_list('status', flat=True).first()


@receiver(post_save, sender=Transaction)
def notify_completed_payment(sender, instance, created, **kwargs):
	if instance.status != Transaction.Status.COMPLETED:
		return
	if created or getattr(instance, '_previous_status', None) != Transaction.Status.COMPLETED:
		from apps.notifications.services import create_notification

		create_notification(
			user=instance.employer.user,
			title='Payment completed',
			message=f'Your KSh {instance.amount_ksh} payment was completed.',
			notification_type='payment',
			link_tab='payments',
		)
