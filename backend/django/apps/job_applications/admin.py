from django.contrib import admin

from .models import JobApplication


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
	list_display = ('job', 'worker', 'status', 'reviewed_by_employer', 'applied_date', 'interview_date')
	list_filter = ('status', 'reviewed_by_employer', 'applied_date')
	search_fields = ('job__title', 'worker__user__phone', 'worker__user__full_name')
	readonly_fields = ('applied_date',)
