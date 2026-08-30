from django.contrib import admin

from .models import Establishment


@admin.register(Establishment)
class EstablishmentAdmin(admin.ModelAdmin):
	list_display = ('name', 'employer', 'establishment_type', 'location', 'is_verified')
	list_filter = ('employer', 'establishment_type', 'location', 'is_verified')
	search_fields = ('name', 'address', 'location', 'employer__user__full_name')
