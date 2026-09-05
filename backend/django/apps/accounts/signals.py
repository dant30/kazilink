from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Profile, User
from .services.referrals import ensure_referral_code


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
	if created:
		Profile.objects.get_or_create(user=instance)
		ensure_referral_code(user=instance)
