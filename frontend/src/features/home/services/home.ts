import { endpoints } from '../../../core/api'
import type { HomeSummary } from '../types'

function count(value: unknown) {
  if (Array.isArray(value)) return value.length
  if (typeof value === 'object' && value !== null && 'count' in value && typeof value.count === 'number') return value.count
  if (typeof value === 'object' && value !== null && 'results' in value && Array.isArray(value.results)) return value.results.length
  return 0
}

export async function loadHomeSummary(): Promise<HomeSummary> {
  const [jobs, catalog] = await Promise.all([endpoints.jobs.list(), endpoints.auth.workerOccupations()])
  const occupations = catalog.occupations
  return {
    live_jobs: count(jobs),
    role_categories: occupations.length,
    occupations,
    availability: catalog.availability,
  }
}
