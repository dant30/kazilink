from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from ..services.occupations import employer_business_type_catalog, worker_availability_catalog, worker_language_catalog, worker_location_catalog, worker_occupation_catalog, worker_skill_catalog


class WorkerOccupationListView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		return Response({'occupations': worker_occupation_catalog(), 'availability': worker_availability_catalog(), 'locations': worker_location_catalog(), 'skills': worker_skill_catalog(), 'languages': worker_language_catalog(), 'business_types': employer_business_type_catalog()})
