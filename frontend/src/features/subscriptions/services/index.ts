import { endpoints } from '../../../core/api'
import type { Subscription, SubscriptionCheckout, SubscriptionCheckoutResponse, SubscriptionPlan } from '../types'

const list = <T>(value: T[] | { results: T[] }) => Array.isArray(value) ? value : value.results

export const subscriptionServices = {
	async getSubscriptions(): Promise<Subscription[]> { return list(await endpoints.subscriptions.list()) },
	getPlans: (): Promise<SubscriptionPlan[]> => endpoints.subscriptions.plans(),
	checkout: (data: SubscriptionCheckout): Promise<SubscriptionCheckoutResponse> => endpoints.subscriptions.checkout(data),
	cancel: (id: number): Promise<Subscription> => endpoints.subscriptions.cancel(id),
}
