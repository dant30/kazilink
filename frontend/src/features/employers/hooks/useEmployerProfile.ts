import { useEffect } from 'react'
import { employerStore, useEmployerStore } from '../store'

export function useEmployerProfile() {
  const state = useEmployerStore()
  useEffect(() => {
    if (!state.profile && !state.loading) employerStore.fetch().catch(() => undefined)
  }, [state.profile, state.loading])
  return { ...state, refresh: employerStore.fetch }
}