from django.db import transaction

from ..models import Job


@transaction.atomic
def create_job(*, employer, validated_data):
	if employer is None:
		raise PermissionError('An employer profile is required to create jobs.')
	if not employer.user.is_employer:
		raise PermissionError('Only employer accounts can create jobs.')
	establishment = validated_data.get('establishment')
	if establishment and not employer.establishments.filter(pk=establishment.pk).exists():
		raise PermissionError('You can only post jobs for your establishment.')
	return Job.objects.create(employer=employer, **validated_data)


@transaction.atomic
def update_job(*, job, validated_data):
	establishment = validated_data.get('establishment')
	if establishment and not job.employer.establishments.filter(pk=establishment.pk).exists():
		raise PermissionError('You can only post jobs for your establishment.')
	for field, value in validated_data.items():
		setattr(job, field, value)
	job.save(update_fields=list(validated_data))
	return job


@transaction.atomic
def close_job(*, job):
	job.status = Job.Status.CLOSED
	job.save(update_fields=['status'])
	return job
