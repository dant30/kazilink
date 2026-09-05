from rest_framework import serializers

from ..models import Referral


class ReferralSerializer(serializers.ModelSerializer):
	referrer_name = serializers.CharField(source='referrer.full_name', read_only=True)
	referred_name = serializers.CharField(source='referred.full_name', read_only=True)
	code = serializers.CharField(source='code.code', read_only=True)

	class Meta:
		model = Referral
		fields = ('id', 'code', 'referrer', 'referrer_name', 'referred', 'referred_name', 'status', 'referrer_reward', 'referred_reward', 'created_at', 'rewarded_at')
		read_only_fields = fields


class ReferralSummarySerializer(serializers.Serializer):
	code = serializers.CharField()
	pending = serializers.IntegerField()
	rewarded = serializers.IntegerField()
	credits_earned = serializers.IntegerField()
	referrals = ReferralSerializer(many=True)
