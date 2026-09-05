// frontend/src/features/workers/types/index.ts

export type WorkerAvailability = 'immediate' | 'night_shifts' | 'full_time' | 'part_time'

export interface WorkerUser {
	id: number
	phone: string
	email: string | null
	full_name: string
	is_worker: boolean
	is_employer: boolean
	is_staff: boolean
	is_superuser: boolean
	is_phone_verified: boolean
	is_id_verified: boolean
	joined_date: string
	avatar?: string | null
}

export interface WorkerProfile {
	id: number
	user: WorkerUser
	primary_role: string
	secondary_roles: string[]
	location: string
	years_of_experience: number
	expected_daily_rate_ksh: number
	expected_monthly_salary_ksh: number | null
	availability: WorkerAvailability
	bio: string
	skills: string[]
	languages: string[]
	avatar: string | null
	rating: number | string
	reviews_count: number
	jobs_completed: number
	punctuality_score: number
	response_time_minutes: number
	is_reference_checked: boolean
	consent_history_sharing: boolean
	national_id_masked: string
	last_employer: string | null
	background_check_verified: boolean
	open_to_work: boolean
	profile_boost_until?: string | null
}

export interface UpdateWorkerProfilePayload {
	primary_role?: string
	secondary_roles?: string[]
	location?: string
	years_of_experience?: number
	expected_daily_rate_ksh?: number
	expected_monthly_salary_ksh?: number | null
	availability?: WorkerAvailability
	bio?: string
	skills?: string[]
	languages?: string[]
	avatar?: File | string | null
	last_employer?: string | null
	background_check_verified?: boolean
	open_to_work?: boolean
	consent_history_sharing?: boolean
}
