from base64 import b64encode
from datetime import datetime
import logging
from json import dumps, loads
from time import sleep
from urllib.error import HTTPError, URLError
from urllib.request import Request, build_opener

from django.conf import settings


logger = logging.getLogger(__name__)


class MpesaConfigurationError(RuntimeError):
	pass


def _request_json(url, *, method='GET', headers=None, payload=None):
	request = Request(
		url,
		data=dumps(payload).encode() if payload is not None else None,
		headers={**(headers or {}), **({'Content-Type': 'application/json'} if payload is not None else {})},
		method=method,
	)
	try:
		with build_opener().open(request, timeout=getattr(settings, 'MPESA_API_TIMEOUT_SECONDS', 15)) as response:
			return loads(response.read().decode())
	except HTTPError as exc:
		body = exc.read().decode(errors='replace')[:1000]
		logger.error('M-Pesa request failed: status=%s url=%s response=%s', exc.code, url, body)
		raise
	except URLError as exc:
		logger.error('M-Pesa request could not reach provider: url=%s reason=%s', url, exc.reason)
		raise


def _request_stk_push(url, *, headers, payload):
	max_retries = max(0, int(getattr(settings, 'MPESA_STK_MAX_RETRIES', 2)))
	backoff_seconds = max(0, float(getattr(settings, 'MPESA_STK_RETRY_BACKOFF_SECONDS', 3)))
	for attempt in range(max_retries + 1):
		try:
			return _request_json(url, headers=headers, payload=payload)
		except HTTPError as exc:
			if exc.code not in (500, 502, 503, 504) or attempt == max_retries:
				raise
		except (TimeoutError, URLError):
			if attempt == max_retries:
				raise
		wait_seconds = backoff_seconds * (2 ** attempt)
		logger.warning('Retrying M-Pesa STK request in %ss: attempt=%s/%s', wait_seconds, attempt + 1, max_retries)
		sleep(wait_seconds)


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
	description = getattr(transaction, 'transaction_type', 'Kazi Credits recharge')
	return _request_stk_push(
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
			'TransactionDesc': description,
		},
	)
