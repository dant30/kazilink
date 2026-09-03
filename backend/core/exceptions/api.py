from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler


class APIError(APIException):
    status_code = 400
    default_detail = 'The request could not be completed.'
    default_code = 'request_error'


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        detail = response.data.get('detail') if isinstance(response.data, dict) and 'detail' in response.data else response.data
        request = context.get('request')
        correlation = getattr(request, 'correlation_id', '')
        response.data = {
            'error': {
                'code': getattr(exc, 'default_code', 'error'),
                'detail': detail,
                'correlation_id': correlation,
            }
        }
        if correlation:
            response['X-Correlation-ID'] = correlation
    return response
