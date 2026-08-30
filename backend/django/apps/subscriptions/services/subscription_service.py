from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from ..models import Subscription


def subscription_for_employer(employer):
	return Subscription.objects.filter(employer=employer).order_by('-started_at')


@transaction.atomic
def activate_subscription(*, employer, plan, duration_days, provider_reference='', payment_id=None):
	from apps.accounts.models import EmployerProfile

	if plan not in {choice for choice, label in EmployerProfile.SubscriptionPlan.choices}:
		raise ValueError('Choose a valid subscription plan.')
	now = timezone.now()
	active = Subscription.objects.select_for_update().filter(
		employer=employer, status=Subscription.Status.ACTIVE, expires_at__gt=now,
	).order_by('-expires_at').first()
	if payment_id and Subscription.objects.filter(provider_reference=f'payment:{payment_id}').exists():
		return Subscription.objects.get(provider_reference=f'payment:{payment_id}')
	start = active.expires_at if active else now
	subscription = Subscription.objects.create(
		employer=employer,
		plan=plan,
		status=Subscription.Status.ACTIVE,
		expires_at=start + timedelta(days=duration_days),
		auto_renew=True,
		provider_reference=f'payment:{payment_id}' if payment_id else provider_reference,
	)
	employer.subscription_plan = plan
	employer.subscription_expires_at = subscription.expires_at
	employer.save(update_fields=('subscription_plan', 'subscription_expires_at'))
	return subscription


@transaction.atomic
def cancel_subscription(*, subscription):
	if subscription.status != Subscription.Status.ACTIVE:
		return subscription
	subscription.status = Subscription.Status.CANCELLED
	subscription.auto_renew = False
	subscription.save(update_fields=('status', 'auto_renew'))
	return subscription


@transaction.atomic
def expire_subscriptions():
	now = timezone.now()
	subscriptions = Subscription.objects.select_related('employer').filter(status=Subscription.Status.ACTIVE, expires_at__lte=now)
	count = 0
	for subscription in subscriptions:
		subscription.status = Subscription.Status.EXPIRED
		subscription.auto_renew = False
		subscription.save(update_fields=('status', 'auto_renew'))
		if subscription.employer.subscription_expires_at and subscription.employer.subscription_expires_at <= now:
			subscription.employer.subscription_plan = 'free'
			subscription.employer.subscription_expires_at = None
			subscription.employer.save(update_fields=('subscription_plan', 'subscription_expires_at'))
		count += 1
	return count