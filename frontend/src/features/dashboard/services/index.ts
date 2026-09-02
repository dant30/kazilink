import { endpoints } from '../../../core/api'
import type { Establishment } from '../../establishments/types'
import type { JobApplicationListResponse } from '../../job_applications/types'
import type { JobListResponse } from '../../jobs/types'
import type { NotificationListResponse } from '../../notifications/types'
import type { Conversation } from '../../messaging/types'
import type { DashboardSnapshot } from '../types'

const results = <T>(value: T[] | { results: T[] }) => Array.isArray(value) ? value : value.results

export const dashboardServices = {
	async loadEmployer(): Promise<DashboardSnapshot> {
		const [jobs, applications, establishments] = await Promise.all([
			endpoints.jobs.list(), endpoints.applications.employer(), endpoints.establishments.mine(),
		])
		return {
			jobs: results(jobs as JobListResponse),
			applications: results(applications as JobApplicationListResponse),
			establishments: results(establishments as Establishment[] | { results: Establishment[] }),
			workerProfile: null, unreadNotifications: 0, activeConversations: 0,
		}
	},
	async loadWorker(): Promise<DashboardSnapshot> {
		const [jobs, applications, workerProfile, notifications, conversations] = await Promise.all([
			endpoints.jobs.recommended(), endpoints.applications.mine(), endpoints.workers.me(),
			endpoints.notifications.list(true), endpoints.messaging.conversations(),
		])
		return {
			jobs: results(jobs as JobListResponse),
			applications: results(applications as JobApplicationListResponse),
			establishments: [], workerProfile,
			unreadNotifications: results(notifications as NotificationListResponse).length,
			activeConversations: results(conversations as Conversation[] | { results: Conversation[] }).length,
		}
	},
}
