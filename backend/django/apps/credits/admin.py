from django.contrib import admin

from .models import CreditEconomyConfig, CreditLedgerEntry, CreditRecharge, CreditWallet


@admin.register(CreditEconomyConfig)
class CreditEconomyConfigAdmin(admin.ModelAdmin):
	list_display = ('ksh_per_credit', 'minimum_recharge_ksh', 'referrer_reward_credits', 'referred_reward_credits', 'updated_at')


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
