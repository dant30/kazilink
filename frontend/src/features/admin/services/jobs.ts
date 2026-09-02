import { endpoints } from '../../../core/api'
import type { Job, JobListResponse } from '../../jobs/types'

export async function listAdminJobs(): Promise<Job[]> {
  const response = await endpoints.jobs.adminList()
  return Array.isArray(response) ? response : response.results
}
