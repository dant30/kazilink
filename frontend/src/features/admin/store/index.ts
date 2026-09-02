import { useSyncExternalStore } from 'react'
import { adminServices } from '../services'
import type { User } from '../../auth/types'

type State = { users: User[]; loading: boolean; initialized: boolean; error: string | null }
const initialState: State = { users: [], loading: false, initialized: false, error: null }
let state = initialState
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())
let request: Promise<User[]> | null = null

export const adminStore = {
	getState: () => state,
	subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
	async fetchUsers() {
		if (request) return request
		state = { ...state, loading: true, error: null }; notify()
		request = adminServices.listUsers().then((users) => { state = { users, loading: false, initialized: true, error: null }; notify(); return users }).catch((error) => { state = { ...state, loading: false, initialized: true, error: error instanceof Error ? error.message : 'Unable to load admin users.' }; notify(); throw error }).finally(() => { request = null })
		return request
	},
}

export function useAdminStore() { return useSyncExternalStore(adminStore.subscribe, adminStore.getState, adminStore.getState) }
