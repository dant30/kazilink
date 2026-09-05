import hashlib
import hmac
import json

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import Transaction
from .services import complete_payment, fail_payment


def _valid_signature(request, body):
	secret = getattr(settings, 'MPESA_WEBHOOK_SECRET', '')
	signature = request.headers.get('X-Mpesa-Signature', '')
	if not secret and not signature:
		return True
	if not secret or not signature:
		return False
	digest = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
	return hmac.compare_digest(digest, signature)


def _native_callback(payload):
	callback = payload.get('Body', {}).get('stkCallback', {})
	provider_reference = callback.get('CheckoutRequestID', '')
	result_code = callback.get('ResultCode')
	if not provider_reference or result_code is None:
		return None
	metadata = {'daraja_callback': callback}
	if str(result_code) == '0':
		return 'completed', provider_reference, metadata
	return 'failed', provider_reference, metadata


@csrf_exempt
@require_POST
def mpesa_callback(request):
	if not _valid_signature(request, request.body):
		return JsonResponse({'detail': 'Invalid webhook signature.'}, status=401)
	try:
		payload = json.loads(request.body)
		native = _native_callback(payload)
		if native:
			status, provider_reference, metadata = native
			try:
				from apps.credits.services import complete_recharge, fail_recharge
				from apps.credits.models import CreditRecharge
				if status == 'completed':
					recharge = complete_recharge(provider_reference=provider_reference, metadata=metadata)
				else:
					recharge = fail_recharge(provider_reference=provider_reference, metadata=metadata)
				return JsonResponse({'recharge_id': recharge.id, 'status': recharge.status})
			except CreditRecharge.DoesNotExist:
				pass
			try:
				payment = Transaction.objects.get(provider_reference=provider_reference)
				if status == 'completed':
					payment = complete_payment(transaction_id=payment.id, provider_reference=provider_reference, metadata=metadata)
				else:
					payment = fail_payment(transaction_id=payment.id, provider_reference=provider_reference, metadata=metadata)
				return JsonResponse({'transaction_id': payment.id, 'status': payment.status})
			except Transaction.DoesNotExist:
				return JsonResponse({'detail': 'Payment or recharge not found.'}, status=404)
		transaction_id = int(payload['transaction_id'])
		status = payload['status'].lower()
	except (ValueError, KeyError, TypeError, json.JSONDecodeError):
		return JsonResponse({'detail': 'Invalid webhook payload.'}, status=400)
	try:
		if status in ('completed', 'success', 'successful'):
			payment = complete_payment(
				transaction_id=transaction_id,
				provider_reference=str(payload.get('provider_reference', '')),
				metadata=payload.get('metadata'),
			)
		elif status in ('failed', 'cancelled', 'canceled'):
			payment = fail_payment(
				transaction_id=transaction_id,
				provider_reference=str(payload.get('provider_reference', '')),
				metadata=payload.get('metadata'),
			)
		else:
			return JsonResponse({'detail': 'Unsupported payment status.'}, status=400)
	except Transaction.DoesNotExist:
		return JsonResponse({'detail': 'Transaction not found.'}, status=404)
	return JsonResponse({'transaction_id': payment.id, 'status': payment.status})
