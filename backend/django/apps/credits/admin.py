from django.contrib import admin

from .models import CreditLedgerEntry, CreditRecharge, CreditWallet


@admin.register(CreditWallet)
class CreditWalletAdmin(admin.ModelAdmin):
	list_display = ('user', 'balance', 'updated_at')
	search_fields = ('user__phone', 'user__full_name')


@admin.register(CreditRecharge)
class CreditRechargeAdmin(admin.ModelAdmin):
	list_display = ('wallet', 'amount_ksh', 'credits', 'status', 'created_at')
	list_filter = ('status',)
	search_fields = ('wallet__user__phone', 'provider_reference')


@admin.register(CreditLedgerEntry)
class CreditLedgerEntryAdmin(admin.ModelAdmin):
	list_display = ('wallet', 'entry_type', 'amount', 'balance_after', 'action', 'created_at')
	list_filter = ('entry_type', 'action')
	search_fields = ('wallet__user__phone', 'reference', 'idempotency_key')
