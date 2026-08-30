from django.contrib import admin

from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
	list_display = ('title', 'employer', 'category', 'location', 'job_type', 'status', 'is_featured', 'posted_date')
	list_filter = ('status', 'job_type', 'category', 'location', 'is_urgent', 'is_featured')
	search_fields = ('title', 'description', 'category', 'location', 'employer__user__full_name')
	readonly_fields = ('applicant_count', 'posted_date')
