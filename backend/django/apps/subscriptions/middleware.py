class SubscriptionContextMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		request.active_subscription = None
		if request.user.is_authenticated and getattr(request.user, 'is_employer', False):
			from django.utils import timezone
			from .models import Subscription

			request.active_subscription = Subscription.objects.filter(
				employer__user=request.user,
				status=Subscription.Status.ACTIVE,
				expires_at__gt=timezone.now(),
			).order_by('-expires_at').first()
		return self.get_response(request)
