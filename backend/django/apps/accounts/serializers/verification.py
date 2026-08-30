from rest_framework import serializers


class PhoneVerificationSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    code = serializers.CharField(min_length=4, max_length=8)
