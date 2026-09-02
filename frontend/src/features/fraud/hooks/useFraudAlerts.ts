import { useEffect } from 'react'
import { fraudStore, useFraudStore } from '../store'

export function useFraudAlerts() {
  const state = useFraudStore()
  useEffect(() => { if (!state.initialized && !state.loading) fraudStore.fetch().catch(() => undefined) }, [state.initialized, state.loading])
  return { ...state, refresh: fraudStore.fetch, updateStatus: fraudStore.updateStatus }
}