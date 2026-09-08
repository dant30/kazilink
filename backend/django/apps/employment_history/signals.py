from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from apps.notifications.models import Notification

from .models import EmploymentRecord


@receiver(pre_save, sender=EmploymentRecord)
def capture_previous_verification_status(sender, instance, **kwargs):
	if instance.pk:
		instance._previous_verification_status = sender.objects.filter(pk=instance.pk).values_list('verification_status', flat=True).first()
		instance._previous_reference_status = sender.objects.filter(pk=instance.pk).values_list('reference_verification_status', flat=True).first()


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
	elif getattr(instance, '_previous_verification_status', EmploymentRecord.VerificationStatus.PENDING) != instance.verification_status and instance.verification_status != EmploymentRecord.VerificationStatus.PENDING:
		Notification.objects.create(
			user=instance.worker.user,
			title='Employment history reviewed',
			message=f'{instance.establishment_name} was {instance.verification_status}.',
			notification_type='verification',
			link_tab='employment_history',
		)
	elif getattr(instance, '_previous_reference_status', EmploymentRecord.ReferenceVerificationStatus.PENDING) != instance.reference_verification_status:
		Notification.objects.create(
			user=instance.worker.user,
			title='Reference verification updated',
			message=f'Reference verification for {instance.establishment_name} is now {instance.reference_verification_status}.',
			notification_type='verification',
			link_tab='employment_history',
		)
