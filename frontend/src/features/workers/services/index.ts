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
		return endpoints.workers.update(data)
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

