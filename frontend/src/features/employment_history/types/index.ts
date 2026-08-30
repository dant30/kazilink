export type EmploymentVerificationStatus = 'pending' | 'verified' | 'rejected'

export type EmploymentRecord = {
  id: number
  worker: number
  worker_name?: string
  establishment_name: string
  establishment_type: string
  location: string
  position: string
  start_date: string
  end_date?: string | null
  is_current: boolean
  responsibilities: string[]
  reference_contact_name: string
  reference_contact_phone: string
  reference_role: string
  verification_status: EmploymentVerificationStatus
  verified_at?: string | null
  verified_by?: string
  verification_notes?: string
}

export type HistoryAccessLog = {
  id: number
  worker: number
  worker_name?: string
  employer: number
  employer_name?: string
  transaction?: number | null
  unlocked_at: string
}

export type EmploymentHistoryFilters = {
  status?: EmploymentVerificationStatus | ''
}

export type EmploymentRecordInput = {
  establishment_name: string
  establishment_type?: string
  location?: string
  position: string
  start_date: string
  end_date?: string | null
  is_current?: boolean
  responsibilities?: string[]
  reference_contact_name: string
  reference_contact_phone: string
  reference_role?: string
}

export type EmploymentHistoryListResponse = EmploymentRecord[] | { count: number; next: string | null; previous: string | null; results: EmploymentRecord[] }
