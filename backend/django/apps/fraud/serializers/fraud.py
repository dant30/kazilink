from rest_framework import serializers

from ..models import FraudAlert


class FraudAlertSerializer(serializers.ModelSerializer):
	class Meta:
		model = FraudAlert
		fields = (
			'id', 'target_type', 'target_id', 'target_name', 'reason', 'severity',
			'status', 'detected_at', 'details', 'resolved_at', 'resolved_by',
		)
		read_only_fields = ('id', 'detected_at', 'resolved_at', 'resolved_by')


class FraudAlertStatusSerializer(serializers.Serializer):
	status = serializers.ChoiceField(choices=(
		(FraudAlert.Status.RESOLVED, 'Resolved'),
		(FraudAlert.Status.DISMISSED, 'Dismissed'),
	))