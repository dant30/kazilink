from django.contrib import admin

from .models import Notification, NotificationPreference


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
	list_display = ('user', 'title', 'notification_type', 'is_read', 'timestamp')
	list_filter = ('notification_type', 'is_read', 'timestamp')
	search_fields = ('user__phone', 'user__full_name', 'title', 'message')


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
	list_display = ('user', 'email_enabled', 'sms_enabled', 'push_enabled')
	list_filter = ('email_enabled', 'sms_enabled', 'push_enabled')
	search_fields = ('user__phone', 'user__full_name')
