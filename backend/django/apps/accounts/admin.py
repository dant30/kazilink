from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import (
	BusinessVerification,
	EmployerProfile,
	IdentityDocument,
	PhoneVerification,
	Profile,
	Referral,
	ReferralCode,
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


@admin.register(IdentityDocument)
class IdentityDocumentAdmin(admin.ModelAdmin):
	list_display = ('user', 'document_type', 'status', 'created_at', 'reviewed_at', 'reviewed_by')
	list_filter = ('document_type', 'status')
	search_fields = ('user__phone', 'user__full_name', 'user__email')
	readonly_fields = ('created_at', 'updated_at')

	def save_model(self, request, obj, form, change):
		super().save_model(request, obj, form, change)
		if obj.document_type == IdentityDocument.DocumentType.NATIONAL_ID:
			obj.user.is_id_verified = obj.status == IdentityDocument.Status.VERIFIED
			obj.user.save(update_fields=('is_id_verified',))


@admin.register(ReferralCode)
class ReferralCodeAdmin(admin.ModelAdmin):
	list_display = ('code', 'owner', 'created_at')
	search_fields = ('code', 'owner__phone', 'owner__full_name', 'owner__email')
	readonly_fields = ('created_at',)


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
	list_display = ('referrer', 'referred', 'code', 'status', 'referrer_reward', 'referred_reward', 'created_at', 'rewarded_at')
	list_filter = ('status', 'created_at', 'rewarded_at')
	search_fields = ('referrer__phone', 'referrer__full_name', 'referred__phone', 'referred__full_name', 'code__code')
	readonly_fields = ('created_at', 'rewarded_at')
