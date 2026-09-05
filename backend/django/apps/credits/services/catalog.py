from ..models import CreditEconomyConfig


CREDIT_ACTIONS = {
	'history_unlock': {'credits': 1, 'roles': ('employer',), 'label': 'Unlock employment history'},
	'application': {'credits': 1, 'roles': ('worker',), 'label': 'Apply to a job'},
	'featured_job_24h': {'credits': 3, 'roles': ('employer',), 'label': 'Feature a job for 24 hours'},
	'job_boost_7d': {'credits': 5, 'roles': ('employer',), 'label': 'Boost a job for 7 days'},
	'premium_job_details': {'credits': 1, 'roles': ('worker',), 'label': 'Unlock premium job details'},
	'profile_boost_7d': {'credits': 3, 'roles': ('worker',), 'label': 'Boost profile for 7 days'},
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
	config = CreditEconomyConfig.current()
	if amount_ksh < config.minimum_recharge_ksh or amount_ksh % config.ksh_per_credit:
		raise ValueError(f'Recharge amount must be at least KSh {config.minimum_recharge_ksh} and a multiple of KSh {config.ksh_per_credit}.')
	return amount_ksh // config.ksh_per_credit
