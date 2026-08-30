from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Conversation, Message
from ..permissions import IsConversationParticipant, IsMessagingUser
from ..serializers import ConversationCreateSerializer, ConversationSerializer, MessageCreateSerializer, MessageSerializer
from ..services import conversations_for_user, get_or_create_conversation, send_message
from apps.accounts.models import EmployerProfile, WorkerProfile
from apps.jobs.models import Job


class ConversationListCreateView(generics.ListCreateAPIView):
	permission_classes = [IsMessagingUser]

	def get_queryset(self):
		return conversations_for_user(self.request.user).prefetch_related('messages')

	def get_serializer_class(self):
		return ConversationCreateSerializer if self.request.method == 'POST' else ConversationSerializer

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		worker = get_object_or_404(WorkerProfile, pk=serializer.validated_data['worker_id'])
		job = None
		if serializer.validated_data.get('job_id'):
			job = get_object_or_404(Job, pk=serializer.validated_data['job_id'])
		if request.user.is_worker:
			worker = request.user.worker_profile
			employer = job.employer if job else get_object_or_404(
				EmployerProfile, pk=serializer.validated_data['employer_id']
			)
		else:
			employer = request.user.employer_profile
		try:
			conversation = get_or_create_conversation(worker=worker, employer=employer, job=job)
		except PermissionError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_403_FORBIDDEN)
		return Response(ConversationSerializer(conversation).data, status=status.HTTP_201_CREATED)


class ConversationDetailView(generics.RetrieveAPIView):
	serializer_class = ConversationSerializer
	permission_classes = [IsConversationParticipant]

	def get_queryset(self):
		return conversations_for_user(self.request.user).prefetch_related('messages')


class MessageListCreateView(generics.ListCreateAPIView):
	permission_classes = [IsConversationParticipant]

	def get_queryset(self):
		conversation = get_object_or_404(conversations_for_user(self.request.user), pk=self.kwargs['conversation_id'])
		return Message.objects.select_related('sender').filter(conversation=conversation)

	def get_serializer_class(self):
		return MessageCreateSerializer if self.request.method == 'POST' else MessageSerializer

	def create(self, request, *args, **kwargs):
		conversation = get_object_or_404(conversations_for_user(request.user), pk=kwargs['conversation_id'])
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		try:
			message = send_message(conversation=conversation, sender=request.user, text=serializer.validated_data['text'])
		except PermissionError as exc:
			return Response({'detail': str(exc)}, status=status.HTTP_403_FORBIDDEN)
		return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)


class MarkConversationReadView(APIView):
	permission_classes = [IsConversationParticipant]

	def post(self, request, conversation_id):
		conversation = get_object_or_404(conversations_for_user(request.user), pk=conversation_id)
		Message.objects.filter(conversation=conversation).exclude(sender=request.user).update(read=True)
		return Response({'marked_read': True})
