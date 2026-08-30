class AuditRequestMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		response = self.get_response(request)
		if request.method not in ('GET', 'HEAD', 'OPTIONS') or response.status_code >= 400:
			try:
				from .services import create_audit_log

				user = request.user if request.user.is_authenticated else None
				create_audit_log(
					action='http_request',
					target_type='endpoint',
					target_id=request.path,
					actor=user,
					metadata={
						'method': request.method,
						'status_code': response.status_code,
						'ip_address': request.META.get('REMOTE_ADDR', ''),
						'request_id': getattr(request, 'request_id', ''),
					},
				)
			except Exception:
				pass
		return response
