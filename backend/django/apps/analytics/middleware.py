class AnalyticsContextMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		request.analytics_enabled = bool(request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))
		return self.get_response(request)
