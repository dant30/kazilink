from base64 import b64encode
from datetime import datetime
from json import dumps, loads
from urllib.error import HTTPError, URLError
from urllib.request import Request, build_opener

from django.conf import settings


class MpesaConfigurationError(RuntimeError):
	pass


def _request_json(url, *, method='GET', headers=None, payload=None):
	request = Request(
		url,
		data=dumps(payload).encode() if payload is not None else None,
		headers={**(headers or {}), **({'Content-Type': 'application/json'} if payload is not None else {})},
		method=method,
	)
	with build_opener().open(request, timeout=getattr(settings, 'MPESA_API_TIMEOUT_SECONDS', 15)) as response:
		return loads(response.read().decode())


def initiate_stk_push(*, transaction, phone_number):
	if not phone_number:
		raise ValueError('A phone number is required for an M-Pesa payment.')
	consumer_key = getattr(settings, 'MPESA_CONSUMER_KEY', '')
	consumer_secret = getattr(settings, 'MPESA_CONSUMER_SECRET', '')
	passkey = getattr(settings, 'MPESA_PASSKEY', '')
	shortcode = getattr(settings, 'MPESA_SHORTCODE', '')
	callback_url = getattr(settings, 'MPESA_CALLBACK_URL', '')
	if not getattr(settings, 'MPESA_ENABLED', False):
		raise MpesaConfigurationError('M-Pesa sandbox payments are disabled.')
	if not all((consumer_key, consumer_secret, passkey, shortcode, callback_url)):
		raise MpesaConfigurationError('M-Pesa is not configured.')
	if not shortcode.isdigit():
		raise MpesaConfigurationError('M-Pesa shortcode must contain only digits.')
	base_url = getattr(settings, 'MPESA_BASE_URL', 'https://sandbox.safaricom.co.ke').rstrip('/')
	timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
	password = b64encode(f'{shortcode}{passkey}{timestamp}'.encode()).decode()
	credentials = b64encode(f'{consumer_key}:{consumer_secret}'.encode()).decode()
	token_response = _request_json(
		f'{base_url}/oauth/v1/generate?grant_type=client_credentials',
		headers={'Authorization': f'Basic {credentials}'},
	)
	access_token = token_response['access_token']
	return _request_json(
		f'{base_url}/mpesa/stkpush/v1/processrequest',
		headers={'Authorization': f'Bearer {access_token}'},
		payload={
			'BusinessShortCode': shortcode,
			'Password': password,
			'Timestamp': timestamp,
			'TransactionType': 'CustomerPayBillOnline',
			'Amount': transaction.amount_ksh,
			'PartyA': phone_number,
			'PartyB': shortcode,
			'PhoneNumber': phone_number,
			'CallBackURL': callback_url,
			'AccountReference': str(transaction.id),
			'TransactionDesc': transaction.transaction_type,
		},
	)
