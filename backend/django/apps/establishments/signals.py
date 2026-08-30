from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from apps.accounts.models import EmployerProfile

from .models import Establishment


def sync_verification(establishment_id):
	if establishment_id is None:
		return
	verified = EmployerProfile.objects.filter(
		establishment_id=establishment_id, verified_business=True
	).exists()
	Establishment.objects.filter(pk=establishment_id).update(is_verified=verified)


@receiver(pre_save, sender=EmployerProfile)
def remember_previous_establishment(sender, instance, **kwargs):
	if not instance.pk:
		instance._previous_establishment_id = None
		return
	instance._previous_establishment_id = sender.objects.filter(pk=instance.pk).values_list(
		'establishment_id', flat=True
	).first()


@receiver(post_save, sender=EmployerProfile)
def sync_after_employer_save(sender, instance, **kwargs):
	sync_verification(instance.establishment_id)
	if instance._previous_establishment_id != instance.establishment_id:
		sync_verification(getattr(instance, '_previous_establishment_id', None))


@receiver(post_delete, sender=EmployerProfile)
def sync_after_employer_delete(sender, instance, **kwargs):
	sync_verification(instance.establishment_id)
