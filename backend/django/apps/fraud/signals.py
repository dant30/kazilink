from django.db.models.signals import post_save
from django.dispatch import receiver

from .services import scan_transaction


@receiver(post_save, sender='payments.Transaction')
def inspect_payment(sender, instance, created, **kwargs):
	if created:
		scan_transaction(instance)
