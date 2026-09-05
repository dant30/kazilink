from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Referral
from ..serializers import ReferralSerializer, ReferralSummarySerializer
from ..services.referrals import ensure_referral_code


class ReferralSummaryView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		referrals = Referral.objects.filter(referrer=request.user).select_related('code', 'referrer', 'referred')
		code = ensure_referral_code(user=request.user)
		rewarded = referrals.filter(status=Referral.Status.REWARDED)
		credits_earned = rewarded.aggregate(total=Sum('referrer_reward'))['total'] or 0
		data = {
			'code': code,
			'pending': referrals.filter(status=Referral.Status.PENDING).count(),
			'rewarded': rewarded.count(),
			'credits_earned': credits_earned,
			'referrals': ReferralSerializer(referrals, many=True).data,
		}
		return Response(ReferralSummarySerializer(data).data)
