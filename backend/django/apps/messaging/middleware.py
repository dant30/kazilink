from urllib.parse import parse_qs


class QueryTokenMiddleware:
	def __init__(self, app):
		self.app = app

	def __call__(self, scope, receive, send):
		query_string = scope.get('query_string', b'').decode('utf-8')
		scope['access_token'] = parse_qs(query_string).get('token', [None])[0]
		return self.app(scope, receive, send)
