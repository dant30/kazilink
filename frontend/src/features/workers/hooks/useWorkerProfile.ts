// frontend/src/features/workers/hooks/useWorkerProfile.ts
import { useEffect } from 'react'
import { useWorkerStore, workerStore } from '../store/workerStore'

/**
 * Hook to fetch and use the current worker's profile
 * Automatically fetches the profile on mount if not already cached
 */
export function useWorkerProfile() {
	const { profile, loading, error, lastUpdated } = useWorkerStore()

	useEffect(() => {
		// Only fetch if we don't have a profile and aren't already loading
		if (!profile && !loading && !lastUpdated) {
			workerStore.fetchProfile().catch(() => {
				console.error('Failed to fetch worker profile')
			})
		}
	}, [profile, loading, lastUpdated])

	return {
		profile,
		loading,
		error,
		isReady: !loading && profile !== null,
		refresh: () => workerStore.fetchProfile(),
	}
}
