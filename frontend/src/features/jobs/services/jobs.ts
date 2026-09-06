import { endpoints } from '../../../core/api'
import type { ApplyJobPayload, CreateJobInput, Job, JobFilters, JobListResponse } from '../types'

export type { ApplyJobPayload, CreateJobInput, Job, JobFilters, JobListResponse }

function normalizeFilters(filters: JobFilters = {}): JobFilters {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ) as JobFilters
}

function queryString(filters: JobFilters = {}) {
  const params = new URLSearchParams()
  Object.entries(normalizeFilters(filters)).forEach(([key, value]) => {
    if (typeof value === 'boolean') {
      params.set(key, value ? 'true' : 'false')
      return
    }
    params.set(key, String(value))
  })
  return params.toString()
}

export function listJobs(filters: JobFilters = {}) {
  return endpoints.jobs.list(queryString(filters))
}

export function getJob(id: number) {
  return endpoints.jobs.detail(id)
}

export function createJob(data: CreateJobInput) {
  return endpoints.jobs.create({
    ...data,
    pay_amount_ksh: Number(data.pay_amount_ksh),
    requirements: data.requirements ?? [],
    benefits: data.benefits ?? [],
    required_skills: data.required_skills ?? [],
    minimum_experience_years: Number(data.minimum_experience_years ?? 0),
  })
}

export function applyForJob(jobId: number, coverNote = '') {
  const payload: ApplyJobPayload = { job: jobId, cover_note: coverNote || undefined }
  return endpoints.applications.create(payload)
}

export function getRecommendedJobs() {
  return endpoints.jobs.recommended()
}

export function getAdminJobs() {
  return endpoints.jobs.adminList()
}

export function updateJob(id: number, data: CreateJobInput) {
  return endpoints.jobs.update(id, {
    ...data,
    pay_amount_ksh: Number(data.pay_amount_ksh),
    requirements: data.requirements ?? [],
    benefits: data.benefits ?? [],
    required_skills: data.required_skills ?? [],
    minimum_experience_years: Number(data.minimum_experience_years ?? 0),
  })
}