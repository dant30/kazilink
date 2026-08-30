class NotificationCountMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		response = self.get_response(request)
		if request.user.is_authenticated:
			from .models import Notification

			response['X-Unread-Notifications'] = str(
				Notification.objects.filter(user=request.user, is_read=False).count()
			)
		return response
