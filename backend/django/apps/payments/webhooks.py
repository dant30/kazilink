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
	if not secret or not signature:
		return False
	digest = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
	return hmac.compare_digest(digest, signature)


@csrf_exempt
@require_POST
def mpesa_callback(request):
	if not _valid_signature(request, request.body):
		return JsonResponse({'detail': 'Invalid webhook signature.'}, status=401)
	try:
		payload = json.loads(request.body)
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
