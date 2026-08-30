from rest_framework.permissions import BasePermission


class IsAccountOwnerOrAdmin(BasePermission):
	def has_object_permission(self, request, view, obj):
		return bool(request.user.is_staff or request.user.is_superuser or obj == request.user)


class IsPhoneVerified(BasePermission):
	message = 'Phone verification is required for this action.'

	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and request.user.is_phone_verified)
