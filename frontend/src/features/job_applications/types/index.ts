export type JobApplicationStatus = 'applied' | 'shortlisted' | 'interview_scheduled' | 'hired' | 'rejected'

export type JobApplication = {
  id: number
  job: number
  job_title?: string
  employer_name?: string
  worker: number
  worker_name?: string
  worker_phone?: string
  cover_note: string
  applied_date: string
  status: JobApplicationStatus
  reviewed_by_employer: boolean
  interview_date?: string | null
  interview_note?: string
}

export type ApplicationFilters = {
  status?: JobApplicationStatus | ''
}

export type ApplicationStatusInput = {
  status: JobApplicationStatus
  interview_date?: string | null
  interview_note?: string
}

export type JobApplicationListResponse = JobApplication[] | { count: number; next: string | null; previous: string | null; results: JobApplication[] }
