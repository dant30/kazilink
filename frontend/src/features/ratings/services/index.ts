import { endpoints } from '../../../core/api'
import { listApplications } from '../../job_applications/services'
import type { ApplicationFilters, JobApplication } from '../../job_applications/types'
import type { Review, ReviewInput, ReviewListResponse } from '../types'

const results = <T>(value: T[] | { results: T[] }) => Array.isArray(value) ? value : value.results

export const ratingServices = {
	async listReviews(): Promise<Review[]> { return results(await endpoints.ratings.list() as ReviewListResponse) },
	createReview: (data: ReviewInput): Promise<Review> => endpoints.ratings.create(data),
	async listEligibleHires(isWorker = false): Promise<JobApplication[]> { const filters: ApplicationFilters = { status: 'hired', engagement_status: 'closed' }; return results(await listApplications(isWorker ? 'mine' : 'employer', filters)) },
}
