from django.utils import timezone
from rest_framework import serializers

from apps.accounts.models import EmployerProfile, WorkerProfile
from apps.establishments.models import Establishment

from ..models import EmploymentRecord, HistoryAccessLog


class EmploymentRecordSerializer(serializers.ModelSerializer):
    worker_name = serializers.CharField(source='worker.user.full_name', read_only=True)
    worker_id = serializers.PrimaryKeyRelatedField(source='worker', queryset=WorkerProfile.objects.all(), write_only=True, required=False)
    establishment_id = serializers.PrimaryKeyRelatedField(source='establishment', queryset=Establishment.objects.all(), write_only=True, required=False, allow_null=True)
    employer_id = serializers.PrimaryKeyRelatedField(source='employer', queryset=EmployerProfile.objects.all(), write_only=True, required=False, allow_null=True)

    class Meta:
        model = EmploymentRecord
        fields = (
            'id', 'worker', 'worker_id', 'worker_name', 'employer', 'employer_id', 'establishment', 'establishment_id',
            'establishment_name', 'establishment_type', 'location', 'position', 'start_date', 'end_date', 'is_current',
            'responsibilities', 'reference_contact_name', 'reference_contact_phone', 'reference_role',
            'verification_status', 'verified_at', 'verified_by', 'verification_notes',
        )
        read_only_fields = (
            'id', 'worker', 'worker_name', 'employer', 'establishment', 'verification_status', 'verified_at',
            'verified_by', 'verification_notes',
        )

    def validate(self, attrs):
        start_date = attrs.get('start_date', getattr(self.instance, 'start_date', None))
        end_date = attrs.get('end_date', getattr(self.instance, 'end_date', None))
        is_current = attrs.get('is_current', getattr(self.instance, 'is_current', False))
        if end_date and start_date and end_date < start_date:
            raise serializers.ValidationError({'end_date': 'End date cannot be before start date.'})
        if is_current and end_date:
            raise serializers.ValidationError({'end_date': 'Current employment cannot have an end date.'})
        return attrs


class HistoryAccessLogSerializer(serializers.ModelSerializer):
    worker_name = serializers.CharField(source='worker.user.full_name', read_only=True)
    employer_name = serializers.CharField(source='employer.user.full_name', read_only=True)

    class Meta:
        model = HistoryAccessLog
        fields = ('id', 'worker', 'worker_name', 'employer', 'employer_name', 'transaction', 'unlocked_at')
        read_only_fields = fields


class UnlockHistorySerializer(serializers.Serializer):
    worker_id = serializers.IntegerField(min_value=1)
    amount_ksh = serializers.IntegerField(min_value=1, default=100)


class VerifyEmploymentSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=(EmploymentRecord.VerificationStatus.VERIFIED, EmploymentRecord.VerificationStatus.REJECTED))
    notes = serializers.CharField(required=False, allow_blank=True)


class HistoryConsentSerializer(serializers.Serializer):
    consent_history_sharing = serializers.BooleanField()
