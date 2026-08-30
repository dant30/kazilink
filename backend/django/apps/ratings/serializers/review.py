from rest_framework import serializers

from ..models import Review


class ReviewSerializer(serializers.ModelSerializer):
    target_worker_name = serializers.CharField(source='target_worker.user.full_name', read_only=True)
    author_name = serializers.CharField(source='author.user.full_name', read_only=True)

    class Meta:
        model = Review
        fields = (
            'id', 'target_worker', 'target_worker_name', 'author', 'author_name',
            'job', 'author_role', 'author_avatar', 'rating', 'comment',
            'role_performed', 'establishment_name', 'date', 'is_verified_hire',
        )
        read_only_fields = ('id', 'author', 'author_name', 'date', 'is_verified_hire')


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('target_worker', 'job', 'rating', 'comment', 'role_performed')

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value

    def validate_comment(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('A review comment is required.')
        return value
