from rest_framework import serializers

from apps.accounts.services.occupations import WORKER_SKILLS

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
            'required_skills', 'minimum_experience_years',
            'is_urgent', 'is_featured', 'featured_until', 'boost_until', 'status', 'applicant_count', 'posted_date',
        )
        read_only_fields = ('id', 'employer', 'employer_name', 'establishment_name', 'featured_until', 'boost_until', 'applicant_count', 'posted_date')


class JobWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = (
            'establishment', 'title', 'category', 'location', 'job_type',
            'pay_amount_ksh', 'pay_period', 'shift_times', 'description',
            'requirements', 'benefits', 'required_skills', 'minimum_experience_years', 'is_urgent', 'status',
        )

    def validate_title(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('A job title is required.')
        return value

    def validate_required_skills(self, value):
        allowed = {key for key, _ in WORKER_SKILLS}
        invalid = sorted(set(value) - allowed)
        if invalid:
            raise serializers.ValidationError(f'Unsupported skills: {", ".join(invalid)}.')
        return list(dict.fromkeys(value))

    def validate_pay_amount_ksh(self, value):
        if value <= 0:
            raise serializers.ValidationError('Pay amount must be greater than zero.')
        return value

    def validate_status(self, value):
        if value == Job.Status.FILLED and self.instance is None:
            raise serializers.ValidationError('A new job cannot start as filled.')
        return value
