from rest_framework import serializers

from ..models import KPISnapshot


class KPISnapshotSerializer(serializers.ModelSerializer):
	class Meta:
		model = KPISnapshot
		fields = '__all__'
		read_only_fields = (
			'id', 'period_start', 'period_end', 'registered_workers',
			'active_employers', 'jobs_posted', 'applications', 'successful_hires',
			'paid_unlocks', 'premium_purchase_rate',
			'average_revenue_per_paying_employer_ksh', 'repeat_employer_rate',
			'customer_acquisition_cost_ksh', 'created_at',
		)


class ReportRangeSerializer(serializers.Serializer):
	period_start = serializers.DateField()
	period_end = serializers.DateField()

	def validate(self, attrs):
		if attrs['period_end'] < attrs['period_start']:
			raise serializers.ValidationError('period_end must be on or after period_start.')
		return attrs