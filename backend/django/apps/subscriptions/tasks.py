from celery import shared_task

from .services import expire_subscriptions


@shared_task
def expire_due_subscriptions():
	return expire_subscriptions()
