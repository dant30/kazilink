class RatingsContextMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		request.rating_worker_id = request.GET.get('worker_id')
		return self.get_response(request)
