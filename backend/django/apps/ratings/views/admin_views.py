from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import Review
from ..serializers import ReviewSerializer


class ReviewAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = ReviewSerializer
	queryset = Review.objects.select_related('target_worker__user', 'author__user', 'job').order_by('-date')
	search_fields = ('comment', 'establishment_name', 'target_worker__user__full_name', 'author__user__full_name')
