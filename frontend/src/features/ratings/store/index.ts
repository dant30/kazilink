import { useSyncExternalStore } from 'react'
import { ratingServices } from '../services'
import type { JobApplication } from '../../job_applications/types'
import type { Review, ReviewInput } from '../types'

type State = { reviews: Review[]; eligibleHires: JobApplication[]; loading: boolean; submitting: boolean; initialized: boolean; eligibleInitialized: boolean; error: string | null }
const initialState: State = { reviews: [], eligibleHires: [], loading: false, submitting: false, initialized: false, eligibleInitialized: false, error: null }
let state = initialState
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Unable to load ratings.'
let request: Promise<Review[]> | null = null

export const ratingStore = {
	getState: () => state,
	subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
	async fetch() {
		if (request) return request
		state = { ...state, loading: true, error: null }; notify()
		request = ratingServices.listReviews().then((reviews) => { state = { ...state, reviews, loading: false, initialized: true }; notify(); return reviews }).catch((error) => { state = { ...state, loading: false, initialized: true, error: errorMessage(error) }; notify(); throw error }).finally(() => { request = null })
		return request
	},
	async fetchEligibleHires() { try { const eligibleHires = await ratingServices.listEligibleHires(); state = { ...state, eligibleHires, eligibleInitialized: true }; notify(); return eligibleHires } catch (error) { state = { ...state, eligibleInitialized: true, error: errorMessage(error) }; notify(); throw error } },
	async create(data: ReviewInput) { state = { ...state, submitting: true, error: null }; notify(); try { const review = await ratingServices.createReview(data); state = { ...state, reviews: [review, ...state.reviews], submitting: false, eligibleHires: state.eligibleHires.filter((application) => !(application.worker === data.target_worker && application.job === data.job)) }; notify(); return review } catch (error) { state = { ...state, submitting: false, error: errorMessage(error) }; notify(); throw error } },
}

export function useRatingStore() { return useSyncExternalStore(ratingStore.subscribe, ratingStore.getState, ratingStore.getState) }
