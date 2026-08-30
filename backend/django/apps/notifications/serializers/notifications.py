from rest_framework import serializers

from ..models import Notification, NotificationPreference


class NotificationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Notification
		fields = ('id', 'title', 'message', 'notification_type', 'timestamp', 'is_read', 'link_tab')
		read_only_fields = fields


class NotificationCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Notification
		fields = ('title', 'message', 'notification_type', 'link_tab')

	def validate_title(self, value):
		return value.strip()

	def validate_message(self, value):
		value = value.strip()
		if not value:
			raise serializers.ValidationError('Message is required.')
		return value


class NotificationPreferenceSerializer(serializers.ModelSerializer):
	class Meta:
		model = NotificationPreference
		fields = ('email_enabled', 'sms_enabled', 'push_enabled')