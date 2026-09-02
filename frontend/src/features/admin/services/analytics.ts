import { endpoints } from '../../../core/api'
import type { KPISnapshot } from '../../analytics/types'

export async function listAdminAnalytics(): Promise<KPISnapshot[]> {
  const response = await endpoints.analytics.adminList()
  return Array.isArray(response) ? response : response.results
}

export function generateAdminAnalytics(period_start: string, period_end: string) {
  return endpoints.analytics.generate({ period_start, period_end })
}

export function exportAdminAnalytics(id: number) {
  return endpoints.analytics.export(id)
}
