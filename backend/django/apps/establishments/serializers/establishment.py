from rest_framework import serializers

from ..models import Establishment


class EstablishmentSerializer(serializers.ModelSerializer):
    verified_employers_count = serializers.SerializerMethodField()

    class Meta:
        model = Establishment
        fields = (
            'id', 'name', 'establishment_type', 'location', 'address', 'logo',
            'is_verified', 'verified_employers_count',
        )
        read_only_fields = ('id', 'is_verified', 'verified_employers_count')

    def get_verified_employers_count(self, obj):
        return getattr(obj, '_verified_employers', obj.employer_profiles.filter(verified_business=True).count())


class EstablishmentWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Establishment
        fields = ('name', 'establishment_type', 'location', 'address', 'logo')

    def validate_name(self, value):
        return value.strip()

    def validate_location(self, value):
        return value.strip()

    def validate_address(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('A physical location is required.')
        return value
