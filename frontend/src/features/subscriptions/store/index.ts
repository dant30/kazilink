import { useSyncExternalStore } from 'react'
import { subscriptionServices } from '../services'
import type { Subscription, SubscriptionPlan } from '../types'

type State = { subscriptions: Subscription[]; plans: SubscriptionPlan[]; loading: boolean; processing: boolean; initialized: boolean; error: string | null; notice: string | null }
const initialState: State = { subscriptions: [], plans: [], loading: false, processing: false, initialized: false, error: null, notice: null }
let state = initialState
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Unable to complete the subscription request.'
let fetchRequest: Promise<{ subscriptions: Subscription[]; plans: SubscriptionPlan[] }> | null = null

export const subscriptionStore = {
	getState: () => state,
	subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
	async fetch() {
		if (fetchRequest) return fetchRequest
		state = { ...state, loading: true, error: null }; notify()
		fetchRequest = Promise.all([subscriptionServices.getSubscriptions(), subscriptionServices.getPlans()])
			.then(([subscriptions, plans]) => { state = { ...state, subscriptions, plans, loading: false, initialized: true }; notify(); return { subscriptions, plans } })
			.catch((error) => { state = { ...state, loading: false, initialized: true, error: errorMessage(error) }; notify(); throw error })
			.finally(() => { fetchRequest = null })
		return fetchRequest
	},
	async checkout(plan: string, phone_number: string) {
		state = { ...state, processing: true, error: null, notice: null }; notify()
		try { const result = await subscriptionServices.checkout({ plan, phone_number }); state = { ...state, processing: false, notice: 'Payment prompt sent. Complete it on your phone to activate the subscription.' }; notify(); return result }
		catch (error) { state = { ...state, processing: false, error: errorMessage(error) }; notify(); throw error }
	},
	async cancel(id: number) {
		state = { ...state, processing: true, error: null, notice: null }; notify()
		try { const subscription = await subscriptionServices.cancel(id); state = { ...state, subscriptions: state.subscriptions.map((item) => item.id === id ? subscription : item), processing: false, notice: 'Subscription cancelled.' }; notify(); return subscription }
		catch (error) { state = { ...state, processing: false, error: errorMessage(error) }; notify(); throw error }
	},
}

export function useSubscriptionStore() { return useSyncExternalStore(subscriptionStore.subscribe, subscriptionStore.getState, subscriptionStore.getState) }
