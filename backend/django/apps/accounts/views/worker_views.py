from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from core.permissions import IsWorker

from ..models import WorkerProfile
from ..serializers import WorkerProfileSerializer


class MyWorkerProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsWorker]
    serializer_class = WorkerProfileSerializer

    def get_object(self):
        return self.request.user.worker_profile


class WorkerListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WorkerProfileSerializer
    queryset = WorkerProfile.objects.select_related('user').all()


class WorkerDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WorkerProfileSerializer
    queryset = WorkerProfile.objects.select_related('user').all()
