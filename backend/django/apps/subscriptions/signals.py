from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.payments.models import Transaction

from .models import Subscription
from .services import activate_subscription


@receiver(post_save, sender=Transaction)
def activate_paid_subscription(sender, instance, created, **kwargs):
	if instance.status != Transaction.Status.COMPLETED or instance.transaction_type != Transaction.TransactionType.SUBSCRIPTION:
		return
	plan = instance.metadata.get('subscription_plan')
	duration_days = instance.metadata.get('duration_days')
	if not plan or not duration_days:
		return
	activate_subscription(
		employer=instance.employer,
		plan=plan,
		duration_days=int(duration_days),
		provider_reference=instance.provider_reference,
		payment_id=instance.id,
	)
