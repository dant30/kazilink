import { useEffect } from 'react'
import { ratingStore, useRatingStore } from '../store'

export function useRatings({ isEmployer = false, isWorker = false }: { isEmployer?: boolean; isWorker?: boolean } = {}) {
  const state = useRatingStore()
  useEffect(() => { if (!state.initialized && !state.loading) ratingStore.fetch().catch(() => undefined) }, [state.initialized, state.loading])
  useEffect(() => { if ((isEmployer || isWorker) && !state.eligibleInitialized) ratingStore.fetchEligibleHires(isWorker).catch(() => undefined) }, [isEmployer, isWorker, state.eligibleInitialized])
  return { ...state, refresh: ratingStore.fetch, refreshEligibleHires: ratingStore.fetchEligibleHires, createReview: ratingStore.create }
}