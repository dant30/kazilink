class ApplicationContextMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		request.application_status_filter = request.GET.get('status', '').strip()
		return self.get_response(request)
