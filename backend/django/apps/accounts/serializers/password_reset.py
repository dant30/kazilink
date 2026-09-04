from rest_framework import serializers


class PasswordResetRequestSerializer(serializers.Serializer):
	phone = serializers.CharField(max_length=15)


class PasswordResetVerifySerializer(serializers.Serializer):
	phone = serializers.CharField(max_length=15)
	code = serializers.CharField(min_length=4, max_length=8)


class PasswordResetConfirmSerializer(serializers.Serializer):
	phone = serializers.CharField(max_length=15)
	reset_token = serializers.CharField(min_length=20, max_length=200)
	new_password = serializers.CharField(min_length=8, write_only=True, trim_whitespace=False)
	confirm_password = serializers.CharField(min_length=8, write_only=True, trim_whitespace=False)

	def validate(self, attrs):
		if attrs['new_password'] != attrs['confirm_password']:
			raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
		return attrs
