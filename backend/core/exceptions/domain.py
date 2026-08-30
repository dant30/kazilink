class DomainError(Exception):
    default_code = 'domain_error'


class PermissionDeniedError(DomainError):
    default_code = 'permission_denied'


class PaymentError(DomainError):
    default_code = 'payment_error'
