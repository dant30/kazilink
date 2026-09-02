import { endpoints } from '../../../core/api'
import type { ApplicationStatusInput, JobApplication, JobApplicationListResponse } from '../../job_applications/types'

const results = (value: JobApplicationListResponse) => Array.isArray(value) ? value : value.results

export const adminApplicationServices = {
  async list(status?: string): Promise<JobApplication[]> {
    const query = status ? `status=${encodeURIComponent(status)}` : ''
    return results(await endpoints.applications.adminList(query))
  },
  updateStatus: (id: number, data: ApplicationStatusInput): Promise<JobApplication> => endpoints.applications.updateStatus(id, data),
}
