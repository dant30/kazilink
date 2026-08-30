class EstablishmentContextMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		request.current_establishment = None
		if getattr(request, 'user', None) and request.user.is_authenticated:
			profile = getattr(request.user, 'employer_profile', None)
			if profile is not None:
				request.current_establishment = profile.establishment
		return self.get_response(request)
