import { endpoints } from '../../../core/api'
import type { User } from '../../auth/types'
import type { AdminUserListResponse } from '../types'

export const adminServices = {
	async listUsers(): Promise<User[]> {
		const response = await endpoints.auth.adminUsers()
		return Array.isArray(response) ? response : response.results
	},
}

export type { AdminUserListResponse }
export { adminApplicationServices } from './applications'
export { listAdminPayments } from './payments'
export { listAdminJobs } from './jobs'
export { listAdminSupportTickets, updateAdminSupportTicket } from './support'
export { listAdminRatings, updateAdminRating, deleteAdminRating } from './ratings'
export { listAdminSubscriptions } from './subscriptions'
export { listAdminAuditLogs } from './audit'
export { listAdminAnalytics, generateAdminAnalytics, exportAdminAnalytics } from './analytics'
