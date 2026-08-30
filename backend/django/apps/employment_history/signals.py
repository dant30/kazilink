from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.notifications.models import Notification

from .models import EmploymentRecord


@receiver(post_save, sender=EmploymentRecord)
def notify_record_submission(sender, instance, created, **kwargs):
	if created:
		Notification.objects.create(
			user=instance.worker.user,
			title='Employment history submitted',
			message=f'{instance.establishment_name} was added to your employment history for review.',
			notification_type='verification',
			link_tab='employment_history',
		)
	elif instance.verification_status != EmploymentRecord.VerificationStatus.PENDING:
		Notification.objects.create(
			user=instance.worker.user,
			title='Employment history reviewed',
			message=f'{instance.establishment_name} was {instance.verification_status}.',
			notification_type='verification',
			link_tab='employment_history',
		)
