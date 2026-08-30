from django.contrib import admin

from django.contrib import admin

from .models import FraudAlert


@admin.register(FraudAlert)
class FraudAlertAdmin(admin.ModelAdmin):
	list_display = ('target_name', 'target_type', 'reason', 'severity', 'status', 'detected_at')
	list_filter = ('target_type', 'severity', 'status', 'detected_at')
	search_fields = ('target_name', 'target_id', 'reason', 'details')
