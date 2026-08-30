from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
	list_display = ('target_worker', 'author', 'rating', 'is_verified_hire', 'date')
	list_filter = ('rating', 'is_verified_hire', 'date')
	search_fields = ('target_worker__user__full_name', 'author__user__full_name', 'comment', 'establishment_name')
	readonly_fields = ('date',)
