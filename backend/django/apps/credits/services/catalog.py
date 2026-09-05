from django.conf import settings


CREDIT_ACTIONS = {
	'history_unlock': {'credits': 1, 'roles': ('employer',), 'label': 'Unlock employment history'},
	'featured_job_24h': {'credits': 3, 'roles': ('employer',), 'label': 'Feature a job for 24 hours'},
	'job_boost_7d': {'credits': 5, 'roles': ('employer',), 'label': 'Boost a job for 7 days'},
	'premium_job_details': {'credits': 1, 'roles': ('worker',), 'label': 'Unlock premium job details'},
	'priority_application': {'credits': 1, 'roles': ('worker',), 'label': 'Priority application'},
	'featured_profile_7d': {'credits': 3, 'roles': ('worker',), 'label': 'Feature profile for 7 days'},
}


def credit_catalog():
	return {key: {**value} for key, value in CREDIT_ACTIONS.items()}


def credit_cost(action, user=None):
	try:
		item = CREDIT_ACTIONS[action]
	except KeyError as exc:
		raise ValueError('Unknown credit action.') from exc
	if user is not None:
		role = 'employer' if user.is_employer else 'worker' if user.is_worker else ''
		if role not in item['roles']:
			raise PermissionError('This credit action is not available for your account role.')
	return item['credits']


def credits_for_amount(amount_ksh):
	value = int(getattr(settings, 'CREDIT_KSH_PER_CREDIT', 20))
	if value <= 0 or amount_ksh <= 0 or amount_ksh % value:
		raise ValueError(f'Recharge amount must be a positive multiple of KSh {value}.')
	return amount_ksh // value
