from django.contrib import admin

from .models import Establishment


@admin.register(Establishment)
class EstablishmentAdmin(admin.ModelAdmin):
	list_display = ('name', 'establishment_type', 'location', 'is_verified')
	list_filter = ('establishment_type', 'location', 'is_verified')
	search_fields = ('name', 'address', 'location')
