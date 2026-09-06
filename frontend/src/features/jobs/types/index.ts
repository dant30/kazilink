export type JobType = 'full_time' | 'part_time' | 'weekend_gig' | 'daily_shift' | 'shift_24hr' | (string & {})
export type JobStatus = 'open' | 'closed' | 'draft' | 'filled' | (string & {})

export type Job = {
  id: number
  employer: number
  employer_name?: string
  title: string
  category: string
  location: string
  job_type: JobType
  pay_amount_ksh: number
  pay_period: string
  description: string
  requirements: string[]
  benefits?: string[]
  status: JobStatus
  is_urgent: boolean
  is_featured: boolean
  featured_until?: string | null
  boost_until?: string | null
  applicant_count: number
  posted_date?: string
  created_at?: string
  updated_at?: string
  company_name?: string
}

export type JobFilters = {
  q?: string
  location?: string
  category?: string
  job_type?: string
  min_pay?: string
  max_pay?: string
  featured?: boolean
  urgent?: boolean
}

export type CreateJobInput = {
  title: string
  category: string
  location: string
  job_type: string
  pay_amount_ksh: number | string
  pay_period: string
  description: string
  shift_times?: string
  requirements?: string[]
  benefits?: string[]
  status?: string
  is_urgent?: boolean
  is_featured?: boolean
}

export type ApplyJobPayload = {
  job: number
  cover_note?: string
}

export type JobListResponse = Job[] | { count: number; next: string | null; previous: string | null; results: Job[] }
