import { useEffect } from 'react'
import { adminStore, useAdminStore } from '../store'

export function useAdminUsers() {
  const state = useAdminStore()
  useEffect(() => { if (!state.initialized && !state.loading) adminStore.fetchUsers().catch(() => undefined) }, [state.initialized, state.loading])
  return { ...state, refresh: adminStore.fetchUsers }
}