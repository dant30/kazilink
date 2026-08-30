from rest_framework import serializers

from ..models import SupportTicket


class SupportTicketSerializer(serializers.ModelSerializer):
	user_name = serializers.CharField(source='user.full_name', read_only=True)
	assigned_to_name = serializers.CharField(source='assigned_to.full_name', read_only=True, allow_null=True)

	class Meta:
		model = SupportTicket
		fields = ('id', 'user', 'user_name', 'subject', 'description', 'status', 'assigned_to', 'assigned_to_name', 'created_at', 'updated_at')
		read_only_fields = ('id', 'user', 'user_name', 'status', 'assigned_to', 'assigned_to_name', 'created_at', 'updated_at')


class SupportTicketCreateSerializer(serializers.ModelSerializer):
	class Meta:
		model = SupportTicket
		fields = ('subject', 'description')

	def validate_subject(self, value):
		value = value.strip()
		if not value:
			raise serializers.ValidationError('Subject is required.')
		return value

	def validate_description(self, value):
		value = value.strip()
		if not value:
			raise serializers.ValidationError('Description is required.')
		return value


class SupportTicketUpdateSerializer(serializers.Serializer):
	status = serializers.ChoiceField(choices=SupportTicket.Status.choices, required=False)
	assigned_to_id = serializers.IntegerField(min_value=1, required=False, allow_null=True)