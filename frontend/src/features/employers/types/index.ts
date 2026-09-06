import type { Establishment } from '../../establishments/types'

export type EmployerUser = {
	id: number
	phone: string
	email: string | null
	full_name: string
	is_employer: boolean
	is_phone_verified: boolean
	is_id_verified: boolean
}

export type EmployerProfile = {
	id: number
	user: EmployerUser
	business_name: string
	location: string
	business_type: string
	contact_person: string
	avatar: string | null
	establishment: number | null
	establishments: number[]
	active_jobs_count: number
	total_hires: number
	history_unlock_credits: number
	subscription_plan: string
	subscription_expires_at: string | null
	average_response_time_minutes: number
	auto_shortlist: boolean
	verified_only: boolean
	verified_business: boolean
}

export type Employer = EmployerProfile

export type UpdateEmployerProfilePayload = Partial<Pick<EmployerProfile,
	'business_name' | 'location' | 'business_type' | 'contact_person' | 'auto_shortlist' | 'verified_only'
>> & { email?: string | null; avatar?: File | string | null }

export type EmployerDashboardData = {
	profile: EmployerProfile
	establishments: Establishment[]
}
