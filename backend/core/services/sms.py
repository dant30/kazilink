import json
import urllib.error
import urllib.request

from django.conf import settings


class SMSDeliveryError(RuntimeError):
	pass


def normalize_kenyan_phone(phone: str) -> str:
	value = ''.join(character for character in str(phone).strip() if character.isdigit() or character == '+')
	if value.startswith('+254'):
		return value[1:]
	if value.startswith('254'):
		return value
	if value.startswith('0') and len(value) == 10:
		return f'254{value[1:]}'
	return value


def send_sms(*, recipient: str, message: str) -> None:
	if not getattr(settings, 'SMS_ENABLED', False):
		return

	token = getattr(settings, 'SMS_API_TOKEN', '')
	sender_id = getattr(settings, 'SMS_SENDER_ID', '')
	if not token or not sender_id:
		raise SMSDeliveryError('SMS delivery is enabled but its token or sender ID is not configured.')

	base_url = getattr(settings, 'SMS_API_BASE_URL', 'https://sms.ots.co.ke/api/v3/').rstrip('/')
	send_path = getattr(settings, 'SMS_API_SEND_PATH', 'sms/send').strip('/')
	url = f'{base_url}/{send_path}'
	payload = json.dumps({
		'recipient': normalize_kenyan_phone(recipient),
		'sender_id': sender_id,
		'type': 'plain',
		'message': message,
	}).encode('utf-8')
	request = urllib.request.Request(
		url,
		data=payload,
		headers={
			'Accept': 'application/json',
			'Authorization': f'Bearer {token}',
			'Content-Type': 'application/json',
		},
		method='POST',
	)

	try:
		with urllib.request.urlopen(request, timeout=getattr(settings, 'SMS_API_TIMEOUT_SECONDS', 10)) as response:
			if response.status < 200 or response.status >= 300:
				raise SMSDeliveryError(f'SMS provider returned HTTP {response.status}.')
	except urllib.error.HTTPError as error:
		raise SMSDeliveryError(f'SMS provider returned HTTP {error.code}.') from error
	except (urllib.error.URLError, TimeoutError) as error:
		raise SMSDeliveryError('SMS provider could not be reached.') from error
