import { useEffect } from 'react'
import { supportStore, useSupport as useStore } from '../store'

export function useSupport() {
  const state = useStore()
  useEffect(() => { if (!state.initialized && !state.loading) supportStore.fetch().catch(() => undefined) }, [state.initialized, state.loading])
  return { ...state, refresh: supportStore.fetch, createTicket: supportStore.create, closeTicket: supportStore.close }
}