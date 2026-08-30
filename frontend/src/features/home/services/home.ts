import { endpoints } from '../../../core/api'
import type { HomeSummary } from '../types'

function count(value: unknown) {
  if (Array.isArray(value)) return value.length
  if (typeof value === 'object' && value !== null && 'count' in value && typeof value.count === 'number') return value.count
  if (typeof value === 'object' && value !== null && 'results' in value && Array.isArray(value.results)) return value.results.length
  return 0
}

export async function loadHomeSummary(): Promise<HomeSummary> {
  const [jobs, notifications, tickets] = await Promise.all([
    endpoints.jobs.recommended(),
    endpoints.notifications.list(true),
    endpoints.support.list(),
  ])
  return {
    recommended_jobs: count(jobs),
    unread_notifications: count(notifications),
    open_support_tickets: count(tickets),
  }
}
