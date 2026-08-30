from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from apps.notifications.models import Notification

from .models import JobApplication


def sync_hire_counts(worker_id, employer_id):
	from apps.accounts.models import EmployerProfile, WorkerProfile

	worker_hires = JobApplication.objects.filter(worker_id=worker_id, status=JobApplication.Status.HIRED).count()
	employer_hires = JobApplication.objects.filter(job__employer_id=employer_id, status=JobApplication.Status.HIRED).count()
	WorkerProfile.objects.filter(pk=worker_id).update(jobs_completed=worker_hires)
	EmployerProfile.objects.filter(pk=employer_id).update(total_hires=employer_hires)


@receiver(pre_save, sender=JobApplication)
def remember_previous_status(sender, instance, **kwargs):
	if instance.pk:
		instance._previous_status = sender.objects.filter(pk=instance.pk).values_list('status', flat=True).first()
	else:
		instance._previous_status = None


@receiver(post_save, sender=JobApplication)
def notify_application_parties(sender, instance, created, **kwargs):
	sync_hire_counts(instance.worker_id, instance.job.employer_id)
	if created:
		Notification.objects.create(
			user=instance.job.employer.user,
			title='New job application',
			message=f'{instance.worker.user.full_name} applied for {instance.job.title}.',
			notification_type='application',
			link_tab='employer_jobs',
		)
		return
	if getattr(instance, '_previous_status', None) != instance.status:
		Notification.objects.create(
			user=instance.worker.user,
			title=f'Application {instance.status.replace("_", " ")}',
			message=f'Your application for {instance.job.title} is now {instance.status.replace("_", " ")}.',
			notification_type='application_status',
			link_tab='applications',
		)


@receiver(post_delete, sender=JobApplication)
def sync_hire_counts_after_delete(sender, instance, **kwargs):
	sync_hire_counts(instance.worker_id, instance.job.employer_id)
