from django.contrib import admin

from django.contrib import admin

from .models import Subscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
	list_display = ('employer', 'plan', 'status', 'started_at', 'expires_at', 'auto_renew')
	list_filter = ('plan', 'status', 'auto_renew', 'expires_at')
	search_fields = ('employer__user__phone', 'employer__user__full_name', 'provider_reference')
	readonly_fields = ('started_at',)
