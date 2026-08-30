from django.contrib import admin

from django.contrib import admin

from .models import SupportTicket


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
	list_display = ('subject', 'user', 'status', 'assigned_to', 'created_at', 'updated_at')
	list_filter = ('status', 'created_at', 'updated_at')
	search_fields = ('subject', 'description', 'user__phone', 'user__full_name')
	readonly_fields = ('created_at', 'updated_at')
