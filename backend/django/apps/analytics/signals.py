from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.audit.services import create_audit_log

from .models import KPISnapshot


@receiver(post_save, sender=KPISnapshot)
def audit_kpi_snapshot(sender, instance, created, **kwargs):
	if created:
		create_audit_log(
			action='kpi_snapshot_created',
			target_type='kpi_snapshot',
			target_id=instance.pk,
			metadata={'period_start': str(instance.period_start), 'period_end': str(instance.period_end)},
		)
