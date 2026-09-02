import { useEffect } from 'react'
import { ratingStore, useRatingStore } from '../store'

export function useRatings({ isEmployer = false }: { isEmployer?: boolean } = {}) {
  const state = useRatingStore()
  useEffect(() => { if (!state.initialized && !state.loading) ratingStore.fetch().catch(() => undefined) }, [state.initialized, state.loading])
  useEffect(() => { if (isEmployer && !state.eligibleInitialized) ratingStore.fetchEligibleHires().catch(() => undefined) }, [isEmployer, state.eligibleInitialized])
  return { ...state, refresh: ratingStore.fetch, refreshEligibleHires: ratingStore.fetchEligibleHires, createReview: ratingStore.create }
}