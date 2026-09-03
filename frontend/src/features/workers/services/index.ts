// frontend/src/features/workers/services/index.ts
import { endpoints } from '../../../core/api'
import type { WorkerProfile, UpdateWorkerProfilePayload } from '../types'

export const workerServices = {
	/**
	 * Fetch the current authenticated worker's profile
	 */
	async getMyProfile(): Promise<WorkerProfile> {
		return endpoints.workers.me()
	},

	/**
	 * Update the current authenticated worker's profile
	 */
	async updateMyProfile(data: UpdateWorkerProfilePayload): Promise<WorkerProfile> {
		return endpoints.workers.update(serializeProfileUpdate(data))
	},

	/**
	 * Fetch a worker's profile by ID
	 */
	async getWorkerProfile(workerId: number): Promise<WorkerProfile> {
		return endpoints.workers.detail(workerId)
	},

	/**
	 * Fetch a list of workers with optional query parameters
	 */
	async getWorkers(query?: string): Promise<WorkerProfile[]> {
		const result = await endpoints.workers.list(query)
		return Array.isArray(result) ? result : result.results
	},
}

function serializeProfileUpdate(data: UpdateWorkerProfilePayload): UpdateWorkerProfilePayload | FormData {
	if (!(data.avatar instanceof File)) return data
	const formData = new FormData()
	Object.entries(data).forEach(([key, value]) => {
		if (value === undefined || value === null) return
		if (Array.isArray(value)) value.forEach((item) => formData.append(key, String(item)))
		else formData.append(key, value instanceof File ? value : String(value))
	})
	return formData
}

