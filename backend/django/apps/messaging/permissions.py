from rest_framework.permissions import BasePermission


class IsConversationParticipant(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated)

	def has_object_permission(self, request, view, obj):
		return bool(request.user.is_staff or request.user.is_superuser or request.user.id in (obj.worker.user_id, obj.employer.user_id))


class IsMessagingUser(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and (request.user.is_worker or request.user.is_employer))
