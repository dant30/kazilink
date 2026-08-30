class SupportContextMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		request.open_support_ticket_count = 0
		if request.user.is_authenticated:
			from .models import SupportTicket

			request.open_support_ticket_count = SupportTicket.objects.filter(
				user=request.user,
				status__in=(SupportTicket.Status.OPEN, SupportTicket.Status.IN_PROGRESS),
			).count()
		return self.get_response(request)
