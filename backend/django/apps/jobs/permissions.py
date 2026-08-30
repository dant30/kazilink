from rest_framework.permissions import BasePermission


class IsEmployer(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and request.user.is_employer)


class IsJobParticipant(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated)


class CanManageJob(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated)

	def has_object_permission(self, request, view, obj):
		return bool(request.user.is_staff or request.user.is_superuser or (
			request.user.is_employer and hasattr(request.user, 'employer_profile')
			and obj.employer_id == request.user.employer_profile.id
		))
