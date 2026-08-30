from rest_framework import serializers

from ..models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.full_name', read_only=True)

    class Meta:
        model = Message
        fields = ('id', 'conversation', 'sender', 'sender_name', 'sender_role', 'text', 'timestamp', 'read')
        read_only_fields = ('id', 'conversation', 'sender', 'sender_name', 'sender_role', 'timestamp')

    def validate_text(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Message text is required.')
        if len(value) > 5000:
            raise serializers.ValidationError('Message text cannot exceed 5,000 characters.')
        return value


class ConversationSerializer(serializers.ModelSerializer):
    worker_name = serializers.CharField(source='worker.user.full_name', read_only=True)
    employer_name = serializers.CharField(source='employer.user.full_name', read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ('id', 'worker', 'worker_name', 'employer', 'employer_name', 'job', 'last_message', 'last_timestamp', 'messages')
        read_only_fields = ('id', 'worker', 'employer', 'worker_name', 'employer_name', 'last_message', 'last_timestamp', 'messages')


class ConversationCreateSerializer(serializers.Serializer):
    worker_id = serializers.IntegerField(min_value=1)
    employer_id = serializers.IntegerField(required=False, min_value=1)
    job_id = serializers.IntegerField(required=False, allow_null=True)

    def validate(self, attrs):
        if not attrs.get('job_id') and not attrs.get('employer_id'):
            raise serializers.ValidationError('employer_id is required when job_id is not provided.')
        return attrs


class MessageCreateSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=5000, trim_whitespace=True)
