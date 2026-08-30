from rest_framework.throttling import AnonRateThrottle, SimpleRateThrottle


class LoginRateThrottle(AnonRateThrottle):
    scope = 'login'
    rate = '10/minute'


class OTPRateThrottle(SimpleRateThrottle):
    scope = 'otp'
    rate = '5/hour'

    def get_cache_key(self, request, view):
        phone = request.data.get('phone') or request.query_params.get('phone') or self.get_ident(request)
        return self.cache_format % {'scope': self.scope, 'ident': phone}
