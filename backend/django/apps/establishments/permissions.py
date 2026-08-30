from rest_framework.permissions import BasePermission


class IsEmployerOrReadOnly(BasePermission):
	def has_permission(self, request, view):
		if request.method in ('GET', 'HEAD', 'OPTIONS'):
			return bool(request.user and request.user.is_authenticated)
		return bool(request.user and request.user.is_authenticated and request.user.is_employer)


class CanManageEstablishment(BasePermission):
	def has_object_permission(self, request, view, obj):
		if request.user.is_staff or request.user.is_superuser:
			return True
		return bool(
			request.user.is_employer
			and hasattr(request.user, 'employer_profile')
			and obj.employer_profiles.filter(pk=request.user.employer_profile.pk).exists()
		)


class IsAdminOrReadOnly(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and (request.method in ('GET', 'HEAD', 'OPTIONS') or request.user.is_staff))
