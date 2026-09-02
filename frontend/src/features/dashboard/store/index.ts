import { useSyncExternalStore } from 'react'
import type { DashboardSnapshot } from '../types'

type State = { data: DashboardSnapshot | null; role: 'worker' | 'employer' | null; loading: boolean; error: string | null }
const initialState: State = { data: null, role: null, loading: false, error: null }
let state = initialState
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())
let request: Promise<DashboardSnapshot> | null = null

export const dashboardStore = {
	getState: () => state,
	subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
	async fetch(role: 'worker' | 'employer', loader: () => Promise<DashboardSnapshot>) {
		if (request && state.role === role) return request
		state = { ...state, role, loading: true, error: null }; notify()
		request = loader().then((data) => { state = { data, role, loading: false, error: null }; notify(); return data }).catch((error) => { state = { ...state, loading: false, error: error instanceof Error ? error.message : 'Unable to load dashboard.' }; notify(); throw error }).finally(() => { request = null })
		return request
	},
}

export function useDashboardStore() { return useSyncExternalStore(dashboardStore.subscribe, dashboardStore.getState, dashboardStore.getState) }
