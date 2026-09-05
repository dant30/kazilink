class CreditsContextMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		user = getattr(request, 'user', None)
		request.credit_role = (
			'employer' if getattr(user, 'is_employer', False)
			else 'worker' if getattr(user, 'is_worker', False)
			else None
		)
		request.credit_idempotency_key = request.headers.get('X-Credit-Idempotency-Key', '').strip()[:100]
		return self.get_response(request)
