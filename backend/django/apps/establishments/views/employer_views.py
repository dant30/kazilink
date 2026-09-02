from rest_framework import generics

from core.permissions import IsEmployer

from ..models import Establishment
from ..serializers import EstablishmentSerializer


class MyEstablishmentListView(generics.ListAPIView):
    permission_classes = [IsEmployer]
    serializer_class = EstablishmentSerializer

    def get_queryset(self):
        return Establishment.objects.filter(
            employer=self.request.user.employer_profile,
        ).order_by('name')
