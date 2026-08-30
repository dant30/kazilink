from django.utils import timezone
from rest_framework import serializers

from ..models import JobApplication


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    employer_name = serializers.CharField(source='job.employer.user.full_name', read_only=True)
    worker_name = serializers.CharField(source='worker.user.full_name', read_only=True)
    worker_phone = serializers.CharField(source='worker.user.phone', read_only=True)

    class Meta:
        model = JobApplication
        fields = (
            'id', 'job', 'job_title', 'employer_name', 'worker', 'worker_name',
            'worker_phone', 'cover_note', 'applied_date', 'status',
            'reviewed_by_employer', 'interview_date', 'interview_note',
        )
        read_only_fields = (
            'id', 'job_title', 'employer_name', 'worker', 'worker_name',
            'worker_phone', 'applied_date', 'status', 'reviewed_by_employer',
        )


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ('job', 'cover_note')


class ApplicationStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=JobApplication.Status.choices)
    interview_date = serializers.DateTimeField(required=False, allow_null=True)
    interview_note = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if attrs.get('status') == JobApplication.Status.INTERVIEW_SCHEDULED and not attrs.get('interview_date'):
            raise serializers.ValidationError({'interview_date': 'An interview date is required.'})
        if attrs.get('interview_date') and attrs['interview_date'] < timezone.now():
            raise serializers.ValidationError({'interview_date': 'The interview date must be in the future.'})
        return attrs
