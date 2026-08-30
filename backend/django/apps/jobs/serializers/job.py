from rest_framework import serializers

from ..models import Job


class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.user.full_name', read_only=True)
    establishment_name = serializers.CharField(source='establishment.name', read_only=True, allow_null=True)

    class Meta:
        model = Job
        fields = (
            'id', 'employer', 'employer_name', 'establishment', 'establishment_name',
            'title', 'category', 'location', 'job_type', 'pay_amount_ksh',
            'pay_period', 'shift_times', 'description', 'requirements', 'benefits',
            'is_urgent', 'is_featured', 'status', 'applicant_count', 'posted_date',
        )
        read_only_fields = ('id', 'employer', 'employer_name', 'establishment_name', 'applicant_count', 'posted_date')


class JobWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = (
            'establishment', 'title', 'category', 'location', 'job_type',
            'pay_amount_ksh', 'pay_period', 'shift_times', 'description',
            'requirements', 'benefits', 'is_urgent', 'is_featured', 'status',
        )

    def validate_title(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('A job title is required.')
        return value

    def validate_pay_amount_ksh(self, value):
        if value <= 0:
            raise serializers.ValidationError('Pay amount must be greater than zero.')
        return value

    def validate_status(self, value):
        if value == Job.Status.FILLED and self.instance is None:
            raise serializers.ValidationError('A new job cannot start as filled.')
        return value
