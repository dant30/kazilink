from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Establishment
from ..permissions import CanManageEstablishment, IsAdminOrReadOnly, IsEmployerOrReadOnly
from ..serializers import EstablishmentSerializer, EstablishmentWriteSerializer
from ..services import create_establishment, set_verification_status, update_establishment


class EstablishmentListCreateView(generics.ListCreateAPIView):
	permission_classes = [IsEmployerOrReadOnly]
	serializer_class = EstablishmentSerializer

	def get_queryset(self):
		queryset = Establishment.objects.annotate(
			_verified_employers=Count('employer_profiles', filter=Q(employer_profiles__verified_business=True))
		).order_by('name')
		query = self.request.query_params.get('q')
		location = self.request.query_params.get('location')
		establishment_type = self.request.query_params.get('type')
		if query:
			queryset = queryset.filter(Q(name__icontains=query) | Q(address__icontains=query))
		if location:
			queryset = queryset.filter(location__iexact=location)
		if establishment_type:
			queryset = queryset.filter(establishment_type__iexact=establishment_type)
		return queryset

	def get_serializer_class(self):
		return EstablishmentWriteSerializer if self.request.method == 'POST' else EstablishmentSerializer

	def perform_create(self, serializer):
		self.establishment = create_establishment(owner=self.request.user, validated_data=serializer.validated_data)

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		try:
			self.perform_create(serializer)
		except PermissionError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_403_FORBIDDEN)
		return Response(EstablishmentSerializer(self.establishment).data, status=status.HTTP_201_CREATED)


class EstablishmentDetailView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Establishment.objects.annotate(
		_verified_employers=Count('employer_profiles', filter=Q(employer_profiles__verified_business=True))
	)
	permission_classes = [IsAdminOrReadOnly]

	def get_serializer_class(self):
		return EstablishmentWriteSerializer if self.request.method in ('PUT', 'PATCH') else EstablishmentSerializer

	def get_permissions(self):
		return [CanManageEstablishment()] if self.request.method in ('PUT', 'PATCH', 'DELETE') else [IsAdminOrReadOnly()]

	def perform_update(self, serializer):
		update_establishment(establishment=self.get_object(), validated_data=serializer.validated_data)


class VerifyEstablishmentView(APIView):
	permission_classes = [IsAdminUser]

	def post(self, request, pk):
		establishment = get_object_or_404(Establishment, pk=pk)
		verified = request.data.get('verified')
		if not isinstance(verified, bool):
			return Response({'detail': 'verified must be a boolean.'}, status=status.HTTP_400_BAD_REQUEST)
		set_verification_status(establishment=establishment, verified=verified)
		return Response(EstablishmentSerializer(establishment).data)
