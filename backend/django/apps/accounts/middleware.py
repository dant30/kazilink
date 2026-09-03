import uuid
import re

from core.logging.correlation import correlation_id


CORRELATION_HEADER = 'X-Correlation-ID'
REQUEST_ID_HEADER = 'X-Request-ID'
_CORRELATION_ID_PATTERN = re.compile(r'^[A-Za-z0-9._:-]{1,128}$')


class RequestIDMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		candidate = request.headers.get(CORRELATION_HEADER) or request.headers.get(REQUEST_ID_HEADER)
		request.correlation_id = candidate if candidate and _CORRELATION_ID_PATTERN.fullmatch(candidate) else str(uuid.uuid4())
		request.request_id = request.correlation_id
		token = correlation_id.set(request.correlation_id)
		try:
			response = self.get_response(request)
			response[CORRELATION_HEADER] = request.correlation_id
			response[REQUEST_ID_HEADER] = request.correlation_id
			return response
		finally:
			correlation_id.reset(token)
