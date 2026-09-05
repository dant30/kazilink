from django.contrib.auth import authenticate
from rest_framework import serializers
from core.utils.validators import normalize_kenyan_phone, validate_password_strength

from ..models import EmployerProfile, Profile, User, UserRole, WorkerProfile
from ..services.occupations import WORKER_AVAILABILITIES


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'phone', 'email', 'full_name', 'is_worker', 'is_employer',
            'is_staff', 'is_superuser', 'is_phone_verified', 'is_id_verified', 'joined_date',
        )
        read_only_fields = ('id', 'is_staff', 'is_superuser', 'is_phone_verified', 'is_id_verified', 'joined_date')


class RegistrationSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    full_name = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True, trim_whitespace=False, validators=[validate_password_strength])
    email = serializers.EmailField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=UserRole.Role.choices)
    primary_role = serializers.CharField(max_length=100, required=False)
    location = serializers.CharField(max_length=100, required=False)
    availability = serializers.ChoiceField(choices=WORKER_AVAILABILITIES, required=False)
    expected_daily_rate_ksh = serializers.IntegerField(min_value=0, required=False)
    bio = serializers.CharField(required=False, allow_blank=False)
    contact_person = serializers.CharField(max_length=255, required=False)
    referral_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    terms_accepted = serializers.BooleanField(required=True)
    privacy_policy_accepted = serializers.BooleanField(required=True)

    def validate(self, attrs):
        try:
            attrs['phone'] = normalize_kenyan_phone(attrs['phone'])
        except Exception as exc:
            raise serializers.ValidationError({'phone': str(exc)}) from exc
        if attrs['role'] == UserRole.Role.WORKER:
            required_fields = ('location', 'availability', 'expected_daily_rate_ksh', 'bio')
            missing = [field for field in required_fields if field not in attrs]
            if missing:
                raise serializers.ValidationError({field: 'This field is required for worker registration.' for field in missing})
        if not attrs['terms_accepted']:
            raise serializers.ValidationError({'terms_accepted': 'You must accept the Terms of Service.'})
        if not attrs['privacy_policy_accepted']:
            raise serializers.ValidationError({'privacy_policy_accepted': 'You must accept the Privacy Policy.'})
        return attrs


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        try:
            phone = normalize_kenyan_phone(attrs['phone'])
        except Exception as exc:
            raise serializers.ValidationError({'phone': str(exc)}) from exc
        phone_candidates = {phone}
        if phone.startswith('+2547'):
            phone_candidates.update((phone[1:], f'0{phone[4:]}'))
        elif phone.startswith('2547'):
            phone_candidates.update((f'+{phone}', f'0{phone[3:]}'))
        elif phone.startswith('07') and len(phone) == 10:
            phone_candidates.update((f'+254{phone[1:]}', f'254{phone[1:]}'))
        user = None
        for candidate in phone_candidates:
            user = authenticate(phone=candidate, password=attrs['password'])
            if user is not None:
                break
        if user is None:
            raise serializers.ValidationError('Invalid phone number or password.')
        if not user.is_phone_verified and not (user.is_staff or user.is_superuser):
            raise serializers.ValidationError('Verify your phone number before signing in.')
        attrs['user'] = user
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('avatar', 'bio', 'location')


class WorkerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = WorkerProfile
        fields = '__all__'
        read_only_fields = (
            'rating', 'reviews_count', 'jobs_completed',
            'background_check_verified',
        )


class EmployerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = EmployerProfile
        fields = '__all__'
        read_only_fields = (
            'active_jobs_count', 'total_hires', 'history_unlock_credits',
            'average_response_time_minutes', 'verified_business',
        )
