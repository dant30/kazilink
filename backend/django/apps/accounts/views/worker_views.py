from datetime import timedelta

from django.db import transaction
from django.db.models import BooleanField, Case, When
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsWorker
from apps.credits.services import spend_credits

from ..models import WorkerProfile
from ..serializers import WorkerProfileSerializer


class MyWorkerProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsWorker]
    serializer_class = WorkerProfileSerializer

    def get_object(self):
        return self.request.user.worker_profile


class CreditProfileBoostView(APIView):
    permission_classes = [IsWorker]

    @transaction.atomic
    def post(self, request):
        profile = request.user.worker_profile
        key = request.data.get('idempotency_key') or f'profile-boost:{request.user.id}'
        try:
            entry = spend_credits(
                user=request.user,
                action='profile_boost_7d',
                reference=f'worker:{profile.id}',
                idempotency_key=key,
                metadata={'worker_id': profile.id, 'duration_days': 7},
            )
        except (PermissionError, ValueError) as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        profile.profile_boost_until = timezone.now() + timedelta(days=7)
        profile.save(update_fields=('profile_boost_until',))
        return Response({'profile': WorkerProfileSerializer(profile).data, 'credit_entry_id': entry.id, 'status': 'completed'}, status=status.HTTP_201_CREATED)


class WorkerListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WorkerProfileSerializer

    def get_queryset(self):
        return WorkerProfile.objects.select_related('user').annotate(
            profile_boost_active=Case(
                When(profile_boost_until__gt=timezone.now(), then=True),
                default=False,
                output_field=BooleanField(),
            )
        ).order_by('-profile_boost_active', '-rating', 'user__full_name')


class WorkerDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WorkerProfileSerializer
    queryset = WorkerProfile.objects.select_related('user').all()
