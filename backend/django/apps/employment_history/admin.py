from django.contrib import admin

from .models import EmploymentRecord, HistoryAccessLog


@admin.register(EmploymentRecord)
class EmploymentRecordAdmin(admin.ModelAdmin):
	list_display = ('worker', 'establishment_name', 'position', 'verification_status', 'is_current', 'start_date', 'end_date')
	list_filter = ('verification_status', 'is_current', 'start_date')
	search_fields = ('worker__user__phone', 'worker__user__full_name', 'establishment_name', 'position')


@admin.register(HistoryAccessLog)
class HistoryAccessLogAdmin(admin.ModelAdmin):
	list_display = ('employer', 'worker', 'unlocked_at', 'transaction')
	list_filter = ('unlocked_at',)
	search_fields = ('employer__user__phone', 'worker__user__phone', 'worker__user__full_name')
	readonly_fields = ('employer', 'worker', 'unlocked_at', 'transaction')
