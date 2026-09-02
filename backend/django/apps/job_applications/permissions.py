from rest_framework.permissions import BasePermission


class IsWorkerApplicant(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and request.user.is_worker)


class IsEmployerReviewer(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and request.user.is_employer)


class CanViewApplication(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated)

	def has_object_permission(self, request, view, obj):
		user = request.user
		return bool(
			user.is_staff
			or user.is_superuser
			or (user.is_worker and obj.worker.user_id == user.id)
			or (user.is_employer and obj.job.employer.user_id == user.id)
		)


class CanReviewApplication(BasePermission):
	def has_permission(self, request, view):
		return bool(
			request.user
			and request.user.is_authenticated
			and (request.user.is_staff or request.user.is_superuser or request.user.is_employer)
		)

	def has_object_permission(self, request, view, obj):
		return bool(
			request.user.is_staff
			or request.user.is_superuser
			or obj.job.employer.user_id == request.user.id
		)
