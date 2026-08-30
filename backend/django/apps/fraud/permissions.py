from rest_framework.permissions import BasePermission


class IsFraudReviewer(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))


class CanResolveFraudAlert(IsFraudReviewer):
	def has_object_permission(self, request, view, obj):
		return bool(request.user.is_staff or request.user.is_superuser)
