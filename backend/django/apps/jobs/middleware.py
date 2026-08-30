class JobContextMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		request.job_search_query = request.GET.get('q', '').strip()
		return self.get_response(request)
