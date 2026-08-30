from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from ..models import Review
from ..permissions import CanManageReview, IsEmployerReviewer
from ..serializers import ReviewCreateSerializer, ReviewSerializer, ReviewUpdateSerializer
from ..services import create_review, update_review


class ReviewListCreateView(generics.ListCreateAPIView):
	def get_permissions(self):
		return [IsEmployerReviewer()] if self.request.method == 'POST' else []

	def get_serializer_class(self):
		return ReviewCreateSerializer if self.request.method == 'POST' else ReviewSerializer

	def get_queryset(self):
		queryset = Review.objects.select_related('target_worker__user', 'author__user', 'job').order_by('-date')
		worker_id = self.request.query_params.get('worker_id')
		if worker_id:
			queryset = queryset.filter(target_worker_id=worker_id)
		return queryset

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		try:
			review = create_review(author=request.user.employer_profile, validated_data=serializer.validated_data)
		except PermissionError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_403_FORBIDDEN)
		except ValueError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
		return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Review.objects.select_related('target_worker__user', 'author__user', 'job')
	serializer_class = ReviewSerializer

	def get_permissions(self):
		return [CanManageReview()] if self.request.method in ('PUT', 'PATCH', 'DELETE') else [AllowAny()]

	def get_serializer_class(self):
		return ReviewUpdateSerializer if self.request.method in ('PUT', 'PATCH') else ReviewSerializer

	def perform_update(self, serializer):
		update_review(review=self.get_object(), validated_data=serializer.validated_data)
