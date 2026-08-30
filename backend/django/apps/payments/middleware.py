class PaymentContextMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		request.payment_provider = request.headers.get('X-Payment-Provider', 'mpesa').lower()
		return self.get_response(request)
