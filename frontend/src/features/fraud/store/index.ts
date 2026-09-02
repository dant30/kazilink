import { useSyncExternalStore } from 'react'
import { fraudServices } from '../services'
import type { FraudAlert } from '../types'

type State = { alerts: FraudAlert[]; loading: boolean; initialized: boolean; error: string | null; actionId: number | null }
const initialState: State = { alerts: [], loading: false, initialized: false, error: null, actionId: null }
let state = initialState
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())
let request: Promise<FraudAlert[]> | null = null

export const fraudStore = {
	getState: () => state,
	subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
	async fetch(status?: string, severity?: string) {
		if (request) return request
		state = { ...state, loading: true, error: null }; notify()
		request = fraudServices.listAlerts(status, severity).then((alerts) => { state = { ...state, alerts, loading: false, initialized: true }; notify(); return alerts }).catch((error) => { state = { ...state, loading: false, initialized: true, error: error instanceof Error ? error.message : 'Unable to load fraud alerts.' }; notify(); throw error }).finally(() => { request = null })
		return request
	},
	async updateStatus(id: number, status: 'resolved' | 'dismissed') {
		state = { ...state, actionId: id, error: null }; notify()
		try { const alert = await fraudServices.resolve(id, status); state = { ...state, alerts: state.alerts.map((item) => item.id === id ? alert : item), actionId: null }; notify(); return alert }
		catch (error) { state = { ...state, actionId: null, error: error instanceof Error ? error.message : 'Unable to update fraud alert.' }; notify(); throw error }
	},
}

export function useFraudStore() { return useSyncExternalStore(fraudStore.subscribe, fraudStore.getState, fraudStore.getState) }
