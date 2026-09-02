import { useEffect } from 'react'
import { subscriptionStore, useSubscriptionStore } from '../store'

export function useSubscriptions({ enabled = true }: { enabled?: boolean } = {}) {
  const state = useSubscriptionStore()
  useEffect(() => { if (enabled && !state.initialized && !state.loading) subscriptionStore.fetch().catch(() => undefined) }, [enabled, state.initialized, state.loading])
  return { ...state, refresh: subscriptionStore.fetch, checkout: subscriptionStore.checkout, cancel: subscriptionStore.cancel }
}