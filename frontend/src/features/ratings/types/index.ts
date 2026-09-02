export type Review = {
	id: number
	target_worker: number
	target_worker_name: string
	author: number
	author_name: string
	job: number | null
	author_role: string
	author_avatar: string | null
	rating: number | string
	comment: string
	role_performed: string
	establishment_name: string
	date: string
	is_verified_hire: boolean
}

export type ReviewInput = { target_worker: number; job: number; rating: number; comment: string; role_performed: string }
export type ReviewUpdateInput = Pick<ReviewInput, 'rating' | 'comment' | 'role_performed'>
export type ReviewListResponse = Review[] | { count: number; next: string | null; previous: string | null; results: Review[] }
