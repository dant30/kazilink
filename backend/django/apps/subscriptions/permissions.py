from rest_framework.permissions import BasePermission


class IsEmployer(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and request.user.is_employer)


class IsSubscriptionOwner(IsEmployer):
	def has_permission(self, request, view):
		return bool(
			request.user
			and request.user.is_authenticated
			and (request.user.is_staff or request.user.is_superuser or request.user.is_employer)
		)

	def has_object_permission(self, request, view, obj):
		return bool(request.user.is_staff or request.user.is_superuser or obj.employer.user_id == request.user.id)
