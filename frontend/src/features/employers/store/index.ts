import { useSyncExternalStore } from 'react'
import { employerServices } from '../services'
import type { EmployerProfile, UpdateEmployerProfilePayload } from '../types'
import type { Establishment } from '../../establishments/types'

type EmployerState = {
	profile: EmployerProfile | null
	establishments: Establishment[]
	loading: boolean
	error: string | null
}

const initialState: EmployerState = { profile: null, establishments: [], loading: false, error: null }
let state = initialState
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Unable to load employer data.'

export const employerStore = {
	getState: () => state,
	subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
	fetch: async () => {
		state = { ...state, loading: true, error: null }; notify()
		try {
			const [profile, establishments] = await Promise.all([
				employerServices.getMyProfile(),
				employerServices.getMyEstablishments(),
			])
			state = { profile, establishments, loading: false, error: null }; notify()
			return { profile, establishments }
		} catch (error) {
			state = { ...state, loading: false, error: errorMessage(error) }; notify(); throw error
		}
	},
	update: async (data: UpdateEmployerProfilePayload) => {
		state = { ...state, loading: true, error: null }; notify()
		try {
			const profile = await employerServices.updateMyProfile(data)
			state = { ...state, profile, loading: false, error: null }; notify(); return profile
		} catch (error) {
			state = { ...state, loading: false, error: errorMessage(error) }; notify(); throw error
		}
	},
}

export function useEmployerStore() {
	return useSyncExternalStore(employerStore.subscribe, employerStore.getState, employerStore.getState)
}
