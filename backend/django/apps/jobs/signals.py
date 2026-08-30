from django.db.models.signals import post_delete, post_save
from django.contrib.postgres.search import SearchVector
from django.dispatch import receiver

from apps.job_applications.models import JobApplication

from .models import Job


def sync_applicant_count(job_id):
	if job_id is not None:
		Job.objects.filter(pk=job_id).update(
			applicant_count=JobApplication.objects.filter(job_id=job_id).count()
		)


def sync_active_jobs_count(employer_id):
	if employer_id is not None:
		from apps.accounts.models import EmployerProfile

		EmployerProfile.objects.filter(pk=employer_id).update(
			active_jobs_count=Job.objects.filter(
				employer_id=employer_id,
				status=Job.Status.OPEN,
			).count()
		)


def update_search_document(job_id):
	Job.objects.filter(pk=job_id).update(
		search_document=(
			SearchVector('title', weight='A', config='simple')
			+ SearchVector('category', weight='B', config='simple')
			+ SearchVector('description', weight='C', config='simple')
		)
	)


@receiver(post_save, sender=JobApplication)
def update_count_after_application(sender, instance, **kwargs):
	sync_applicant_count(instance.job_id)


@receiver(post_delete, sender=JobApplication)
def update_count_after_application_delete(sender, instance, **kwargs):
	sync_applicant_count(instance.job_id)


@receiver(post_save, sender=Job)
def update_active_jobs_count(sender, instance, **kwargs):
	sync_active_jobs_count(instance.employer_id)


@receiver(post_delete, sender=Job)
def update_active_jobs_count_after_delete(sender, instance, **kwargs):
	sync_active_jobs_count(instance.employer_id)


@receiver(post_save, sender=Job)
def update_job_search_document(sender, instance, **kwargs):
	update_search_document(instance.pk)
