from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from apps.accounts.models import User

from .models import CreditRecharge, CreditWallet


@receiver(post_save, sender=User)
def create_credit_wallet(sender, instance, created, **kwargs):
	if created:
		CreditWallet.objects.get_or_create(user=instance)


@receiver(pre_save, sender=CreditRecharge)
def capture_previous_recharge_status(sender, instance, **kwargs):
	if instance.pk:
		instance._previous_status = sender.objects.filter(pk=instance.pk).values_list('status', flat=True).first()


@receiver(post_save, sender=CreditRecharge)
def notify_completed_recharge(sender, instance, created, **kwargs):
	if instance.status != CreditRecharge.Status.COMPLETED:
		return
	if created or getattr(instance, '_previous_status', None) != CreditRecharge.Status.COMPLETED:
		from apps.notifications.services import create_notification

		create_notification(
			user=instance.wallet.user,
			title='Kazi Credits added',
			message=f'{instance.credits} Kazi Credits were added to your wallet.',
			notification_type='payment',
			link_tab='payments',
		)
