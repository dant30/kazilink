from django.contrib import admin

from .models import Conversation, Message


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
	list_display = ('worker', 'employer', 'job', 'last_timestamp')
	list_filter = ('last_timestamp',)
	search_fields = ('worker__user__full_name', 'employer__user__full_name', 'last_message')


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
	list_display = ('conversation', 'sender', 'sender_role', 'timestamp', 'read')
	list_filter = ('sender_role', 'read', 'timestamp')
	search_fields = ('sender__phone', 'sender__full_name', 'text')
	readonly_fields = ('timestamp',)
