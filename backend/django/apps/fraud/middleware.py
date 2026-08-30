class FraudContextMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		request.fraud_context = {
			'ip_address': request.META.get('REMOTE_ADDR', ''),
			'user_agent': request.META.get('HTTP_USER_AGENT', ''),
		}
		return self.get_response(request)
