export type HomeOption = { value: string; label: string }
export type HomeSummary = {
	live_jobs: number
	role_categories: number
	occupations: HomeOption[]
	availability: HomeOption[]
}
