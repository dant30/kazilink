from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from .models import Review
from .services import recalculate_worker_rating


@receiver(pre_save, sender=Review)
def snapshot_review_author(sender, instance, **kwargs):
	if instance.author_id and not instance.author_name:
		instance.author_name = instance.author.user.full_name


@receiver(post_save, sender=Review)
def update_worker_rating(sender, instance, **kwargs):
	recalculate_worker_rating(instance.target_worker_id)
	


@receiver(post_delete, sender=Review)
def update_worker_rating_after_delete(sender, instance, **kwargs):
	recalculate_worker_rating(instance.target_worker_id)
