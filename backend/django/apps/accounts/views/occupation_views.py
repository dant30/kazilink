from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from ..services.occupations import worker_availability_catalog, worker_occupation_catalog


class WorkerOccupationListView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		return Response({'occupations': worker_occupation_catalog(), 'availability': worker_availability_catalog()})
