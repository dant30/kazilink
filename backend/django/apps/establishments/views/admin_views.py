from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import Establishment
from ..serializers import EstablishmentSerializer


class EstablishmentAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = EstablishmentSerializer
	queryset = Establishment.objects.all().order_by('name')
	search_fields = ('name', 'location', 'address')
