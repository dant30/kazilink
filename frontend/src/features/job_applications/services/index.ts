import { endpoints } from '../../../core/api'
import type { ApplicationFilters, ApplicationStatusInput, JobApplication, JobApplicationListResponse } from '../types'

export function listApplications(scope: 'mine' | 'employer' | 'admin' = 'mine', filters: ApplicationFilters = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)

  const query = params.toString()
  if (scope === 'mine') return endpoints.applications.mine(query)
  if (scope === 'employer') return endpoints.applications.employer(query)
  return endpoints.applications.adminList(query)
}

export function getApplication(id: number) {
  return endpoints.applications.detail(id)
}

export function createApplication(payload: { job: number; cover_note?: string }) {
  return endpoints.applications.create(payload)
}

export function updateApplicationStatus(id: number, data: ApplicationStatusInput) {
  return endpoints.applications.updateStatus(id, data)
}

export type { ApplicationFilters, ApplicationStatusInput, JobApplication, JobApplicationListResponse }
