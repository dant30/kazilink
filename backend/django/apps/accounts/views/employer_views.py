from rest_framework import generics

from core.permissions import IsEmployer

from ..models import EmployerProfile
from ..serializers import EmployerProfileSerializer


class MyEmployerProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsEmployer]
    serializer_class = EmployerProfileSerializer

    def get_object(self):
        return self.request.user.employer_profile
