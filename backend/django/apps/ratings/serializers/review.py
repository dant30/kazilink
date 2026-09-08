from rest_framework import serializers

from apps.accounts.models import EmployerProfile

from ..models import Review


class ReviewSerializer(serializers.ModelSerializer):
    target_worker_name = serializers.CharField(source='target_worker.user.full_name', read_only=True)
    target_employer_name = serializers.CharField(source='target_employer.user.full_name', read_only=True)
    author_name = serializers.SerializerMethodField()

    def get_author_name(self, obj):
        author = obj.author or obj.author_worker
        return author.user.full_name if author else ''

    class Meta:
        model = Review
        fields = (
            'id', 'target_worker', 'target_worker_name', 'target_employer', 'target_employer_name',
            'author', 'author_worker', 'author_name',
            'job', 'author_role', 'author_avatar', 'rating', 'comment',
            'role_performed', 'establishment_name', 'date', 'is_verified_hire',
        )
        read_only_fields = ('id', 'author', 'author_worker', 'author_name', 'date', 'is_verified_hire')


class ReviewCreateSerializer(serializers.ModelSerializer):
    target_employer = serializers.PrimaryKeyRelatedField(queryset=EmployerProfile.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Review
        fields = ('target_worker', 'target_employer', 'job', 'rating', 'comment', 'role_performed')

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value

    def validate_comment(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('A review comment is required.')
        return value

    def validate(self, attrs):
        if not attrs.get('target_worker') and not attrs.get('target_employer'):
            raise serializers.ValidationError('Select a worker or employer to review.')
        if attrs.get('target_worker') and attrs.get('target_employer'):
            raise serializers.ValidationError('Select only one review target.')
        return attrs
