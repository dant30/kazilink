export type EmploymentVerificationStatus = 'pending' | 'verified' | 'rejected'

export type EmploymentRecord = {
  id: number
  worker: number
  worker_name?: string
  employer?: number | null
  establishment?: number | null
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
  reference_verification_status?: 'pending' | 'contacted' | 'verified' | 'failed' | 'rejected'
  reference_verification_attempts?: number
  reference_last_attempt_at?: string | null
  reference_next_attempt_at?: string | null
  reference_verified_at?: string | null
  reference_verified_by?: string
  employer_verified_at?: string | null
  employer_verified_by?: string
}

export type HistoryAccessLog = {
  id: number
  worker: number
  worker_name?: string
  employer: number
  employer_name?: string
  transaction?: number | null
  unlocked_at: string
  revoked_at?: string | null
  revoked_by?: number | null
  revocation_reason?: string
}

export type EmploymentHistoryFilters = {
  status?: EmploymentVerificationStatus | ''
}

export type EmploymentRecordInput = {
  worker_id?: number
  employer_id?: number
  establishment_id?: number
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
