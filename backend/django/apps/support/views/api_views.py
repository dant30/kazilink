from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import SupportTicket
from ..permissions import IsSupportStaff, IsTicketOwner
from ..serializers import SupportTicketCreateSerializer, SupportTicketSerializer, SupportTicketUpdateSerializer
from ..services import create_ticket, update_ticket


class TicketListCreateView(generics.ListCreateAPIView):
	permission_classes = [IsTicketOwner]

	def get_queryset(self):
		return SupportTicket.objects.select_related('user', 'assigned_to').filter(user=self.request.user)

	def get_serializer_class(self):
		return SupportTicketCreateSerializer if self.request.method == 'POST' else SupportTicketSerializer

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		ticket = create_ticket(user=request.user, **serializer.validated_data)
		return Response(SupportTicketSerializer(ticket).data, status=status.HTTP_201_CREATED)


class TicketDetailView(generics.RetrieveAPIView):
	permission_classes = [IsTicketOwner]
	serializer_class = SupportTicketSerializer

	def get_queryset(self):
		return SupportTicket.objects.select_related('user', 'assigned_to').filter(user=self.request.user)


class TicketCloseView(APIView):
	permission_classes = [IsTicketOwner]

	def post(self, request, pk):
		ticket = get_object_or_404(SupportTicket.objects.select_related('user', 'assigned_to'), pk=pk)
		self.check_object_permissions(request, ticket)
		if ticket.status not in (SupportTicket.Status.RESOLVED, SupportTicket.Status.IN_PROGRESS, SupportTicket.Status.OPEN):
			return Response({'detail': 'This ticket is already closed.'}, status=status.HTTP_400_BAD_REQUEST)
		ticket = update_ticket(ticket=ticket, status=SupportTicket.Status.CLOSED)
		return Response(SupportTicketSerializer(ticket).data)


class StaffTicketUpdateView(APIView):
	permission_classes = [IsSupportStaff]

	def patch(self, request, pk):
		ticket = get_object_or_404(SupportTicket.objects.select_related('user', 'assigned_to'), pk=pk)
		serializer = SupportTicketUpdateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		data = serializer.validated_data
		if 'assigned_to_id' in data and data['assigned_to_id']:
			from django.contrib.auth import get_user_model

			if not get_user_model().objects.filter(pk=data['assigned_to_id'], is_staff=True).exists():
				return Response({'detail': 'The assignee must be a staff user.'}, status=status.HTTP_400_BAD_REQUEST)
		ticket = update_ticket(
			ticket=ticket,
			status=data.get('status'),
			assigned_to_id=data.get('assigned_to_id') if 'assigned_to_id' in data else None,
		)
		return Response(SupportTicketSerializer(ticket).data)
