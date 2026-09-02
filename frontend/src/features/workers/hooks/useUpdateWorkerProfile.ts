// frontend/src/features/workers/hooks/useUpdateWorkerProfile.ts
import { useCallback, useState } from 'react'
import { workerStore } from '../store/workerStore'
import type { UpdateWorkerProfilePayload, WorkerProfile } from '../types'

interface UseUpdateWorkerProfileReturn {
	updating: boolean
	error: string | null
	success: boolean
	updateProfile: (data: UpdateWorkerProfilePayload) => Promise<WorkerProfile>
	clearError: () => void
	clearSuccess: () => void
}

/**
 * Hook to update the current worker's profile
 */
export function useUpdateWorkerProfile(): UseUpdateWorkerProfileReturn {
	const [updating, setUpdating] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)

	const updateProfile = useCallback(
		async (data: UpdateWorkerProfilePayload): Promise<WorkerProfile> => {
			setUpdating(true)
			setError(null)
			setSuccess(false)

			try {
				const result = await workerStore.updateProfile(data)
				setSuccess(true)
				setUpdating(false)
				return result
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
				setError(errorMessage)
				setUpdating(false)
				throw err
			}
		},
		[]
	)

	const clearError = useCallback(() => setError(null), [])
	const clearSuccess = useCallback(() => setSuccess(false), [])

	return {
		updating,
		error,
		success,
		updateProfile,
		clearError,
		clearSuccess,
	}
}
