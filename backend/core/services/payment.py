from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class PaymentRequest:
	employer_id: int
	amount_ksh: Decimal
	phone: str
	description: str


@dataclass(frozen=True)
class PaymentResult:
	accepted: bool
	provider: str
	provider_reference: str = ''
	detail: str = ''


def process_payment(request, provider='mpesa'):
	if not isinstance(request, PaymentRequest):
		raise TypeError('request must be a PaymentRequest.')
	if request.amount_ksh <= 0:
		raise ValueError('Payment amount must be greater than zero.')
	if not request.phone:
		raise ValueError('A payment phone number is required.')
	return PaymentResult(
		accepted=False,
		provider=provider,
		detail='Payment provider integration is not configured.',
	)
