from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler


class APIError(APIException):
    status_code = 400
    default_detail = 'The request could not be completed.'
    default_code = 'request_error'


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None and isinstance(response.data, dict) and 'detail' in response.data:
        response.data = {'error': {'code': getattr(exc, 'default_code', 'error'), 'detail': response.data['detail']}}
    return response
