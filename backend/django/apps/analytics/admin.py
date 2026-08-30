from django.contrib import admin

from .models import KPISnapshot


@admin.register(KPISnapshot)
class KPISnapshotAdmin(admin.ModelAdmin):
	list_display = ('period_start', 'period_end', 'active_employers', 'registered_workers', 'jobs_posted', 'paid_unlocks')
	list_filter = ('period_start', 'period_end')
	date_hierarchy = 'period_end'
