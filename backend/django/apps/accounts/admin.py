from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import (
	BusinessVerification,
	EmployerProfile,
	PhoneVerification,
	Profile,
	User,
	UserRole,
	WorkerProfile,
)


@admin.register(User)
class UserAdmin(UserAdmin):
	ordering = ('phone',)
	list_display = ('phone', 'full_name', 'is_worker', 'is_employer', 'is_phone_verified', 'is_active', 'is_staff')
	list_filter = ('is_worker', 'is_employer', 'is_phone_verified', 'is_id_verified', 'is_active', 'is_staff')
	search_fields = ('phone', 'full_name', 'email')
	fieldsets = (
		(None, {'fields': ('phone', 'password')}),
		('Personal information', {'fields': ('full_name', 'email')}),
		('Roles and verification', {'fields': ('is_worker', 'is_employer', 'is_phone_verified', 'is_id_verified')}),
		('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
		('Dates', {'fields': ('last_login', 'joined_date')}),
	)
	add_fieldsets = (
		(None, {'classes': ('wide',), 'fields': ('phone', 'full_name', 'password1', 'password2')}),
	)
	readonly_fields = ('last_login', 'joined_date')


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'location')
	search_fields = ('user__phone', 'user__full_name', 'location')


@admin.register(WorkerProfile)
class WorkerProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'primary_role', 'location', 'availability', 'rating', 'is_reference_checked', 'consent_history_sharing')
	list_filter = ('availability', 'is_reference_checked', 'consent_history_sharing')
	search_fields = ('user__phone', 'user__full_name', 'primary_role', 'location', 'skills')
	readonly_fields = ('rating', 'reviews_count', 'jobs_completed')


@admin.register(EmployerProfile)
class EmployerProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'establishment', 'subscription_plan', 'verified_business', 'active_jobs_count', 'total_hires')
	list_filter = ('subscription_plan', 'verified_business')
	search_fields = ('user__phone', 'user__full_name', 'contact_person', 'establishment__name')
	readonly_fields = ('active_jobs_count', 'total_hires')


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
	list_display = ('user', 'role')
	list_filter = ('role',)
	search_fields = ('user__phone', 'user__full_name')


@admin.register(PhoneVerification)
class PhoneVerificationAdmin(admin.ModelAdmin):
	list_display = ('user', 'expires_at', 'verified_at', 'attempts')
	list_filter = ('verified_at',)
	search_fields = ('user__phone', 'user__full_name')
	readonly_fields = ('code_hash', 'created_at')


@admin.register(BusinessVerification)
class BusinessVerificationAdmin(admin.ModelAdmin):
	list_display = ('employer', 'status', 'reviewed_at', 'reviewed_by')
	list_filter = ('status',)
	search_fields = ('employer__user__phone', 'employer__user__full_name')
	readonly_fields = ('reviewed_at',)
