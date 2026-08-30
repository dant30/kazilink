from django.contrib import admin

from django.contrib import admin

from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
	list_display = ('employer', 'transaction_type', 'amount_ksh', 'status', 'provider', 'created_at', 'completed_at')
	list_filter = ('transaction_type', 'status', 'provider', 'created_at')
	search_fields = ('employer__user__phone', 'employer__user__full_name', 'provider_reference')
	readonly_fields = ('created_at', 'completed_at')
