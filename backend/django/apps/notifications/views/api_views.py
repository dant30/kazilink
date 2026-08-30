from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import NotificationPreference
from ..permissions import IsNotificationOwner
from ..serializers import NotificationPreferenceSerializer, NotificationSerializer
from ..services import get_or_create_preferences, mark_notification_read, notifications_for_user


class NotificationListView(generics.ListAPIView):
	serializer_class = NotificationSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		queryset = notifications_for_user(self.request.user)
		if self.request.query_params.get('unread', '').lower() in ('1', 'true', 'yes'):
			queryset = queryset.filter(is_read=False)
		return queryset


class NotificationDetailView(generics.RetrieveAPIView):
	serializer_class = NotificationSerializer
	permission_classes = [IsNotificationOwner]

	def get_queryset(self):
		return notifications_for_user(self.request.user)


class MarkNotificationReadView(APIView):
	permission_classes = [IsNotificationOwner]

	def post(self, request, pk):
		notification = get_object_or_404(notifications_for_user(request.user), pk=pk)
		self.check_object_permissions(request, notification)
		return Response(NotificationSerializer(mark_notification_read(notification=notification)).data)


class MarkAllNotificationsReadView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		updated = notifications_for_user(request.user).filter(is_read=False).update(is_read=True)
		return Response({'marked_read': updated})


class NotificationPreferenceView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		return Response(NotificationPreferenceSerializer(get_or_create_preferences(user=request.user)).data)

	def patch(self, request):
		preferences = get_or_create_preferences(user=request.user)
		serializer = NotificationPreferenceSerializer(preferences, data=request.data, partial=True)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data)
