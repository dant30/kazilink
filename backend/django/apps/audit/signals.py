from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from .services import create_audit_log

User = get_user_model()


@receiver(post_save, sender=User)
def audit_user_creation(sender, instance, created, **kwargs):
	if created:
		create_audit_log(
			action='user_created',
			target_type='user',
			target_id=instance.pk,
			actor=instance,
			metadata={'is_worker': instance.is_worker, 'is_employer': instance.is_employer},
		)
