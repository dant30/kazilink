// frontend/src/features/workers/store/workerStore.ts
import { useSyncExternalStore } from 'react'
import { workerServices } from '../services'
import type { WorkerProfile, UpdateWorkerProfilePayload } from '../types'

interface WorkerState {
	profile: WorkerProfile | null
	loading: boolean
	error: string | null
	lastUpdated: number | null
}

const initialState: WorkerState = {
	profile: null,
	loading: false,
	error: null,
	lastUpdated: null,
}

let state = initialState
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export const workerStore = {
	getState: () => state,

	/**
	 * Fetch and cache the current worker's profile
	 */
	fetchProfile: async () => {
		state = { ...state, loading: true, error: null }
		notify()

		try {
			const profile = await workerServices.getMyProfile()
			state = {
				profile,
				loading: false,
				error: null,
				lastUpdated: Date.now(),
			}
			notify()
			return profile
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch worker profile'
			state = {
				...state,
				loading: false,
				error: errorMessage,
			}
			notify()
			throw err
		}
	},

	/**
	 * Update the current worker's profile
	 */
	updateProfile: async (data: UpdateWorkerProfilePayload) => {
		state = { ...state, loading: true, error: null }
		notify()

		try {
			const updatedProfile = await workerServices.updateMyProfile(data)
			state = {
				profile: updatedProfile,
				loading: false,
				error: null,
				lastUpdated: Date.now(),
			}
			notify()
			return updatedProfile
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to update worker profile'
			state = {
				...state,
				loading: false,
				error: errorMessage,
			}
			notify()
			throw err
		}
	},

	/**
	 * Get a worker's profile by ID
	 */
	getWorkerProfile: async (workerId: number) => {
		try {
			return await workerServices.getWorkerProfile(workerId)
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch worker profile'
			state = {
				...state,
				error: errorMessage,
			}
			notify()
			throw err
		}
	},

	/**
	 * Clear the stored profile
	 */
	clearProfile: () => {
		state = initialState
		notify()
	},

	/**
	 * Subscribe to store changes
	 */
	subscribe: (listener: () => void) => {
		listeners.add(listener)
		return () => listeners.delete(listener)
	},
}

/**
 * Hook to use the worker store
 */
export function useWorkerStore() {
	return useSyncExternalStore(workerStore.subscribe, workerStore.getState, workerStore.getState)
}
