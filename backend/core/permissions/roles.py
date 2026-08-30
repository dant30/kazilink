from rest_framework.permissions import BasePermission


class RolePermission(BasePermission):
    required_role = None

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_staff or user.is_superuser:
            return True
        return bool(self.required_role and getattr(user, f'is_{self.required_role}', False))


class IsWorker(RolePermission):
    required_role = 'worker'


class IsEmployer(RolePermission):
    required_role = 'employer'


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))
