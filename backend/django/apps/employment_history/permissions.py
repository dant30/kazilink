from rest_framework.permissions import BasePermission


class IsWorkerOwner(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and request.user.is_worker)

	def has_object_permission(self, request, view, obj):
		return bool(request.user.is_staff or request.user.is_superuser or obj.worker.user_id == request.user.id)


class IsEmployerHistoryViewer(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and request.user.is_employer)


class IsHistoryAdmin(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))
