from rest_framework import serializers

from ..models import KPISnapshot


class KPISnapshotSerializer(serializers.ModelSerializer):
	class Meta:
		model = KPISnapshot
		fields = '__all__'
		read_only_fields = fields


class ReportRangeSerializer(serializers.Serializer):
	period_start = serializers.DateField()
	period_end = serializers.DateField()

	def validate(self, attrs):
		if attrs['period_end'] < attrs['period_start']:
			raise serializers.ValidationError('period_end must be on or after period_start.')
		return attrs