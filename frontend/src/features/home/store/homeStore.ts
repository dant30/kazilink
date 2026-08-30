import { useSyncExternalStore } from 'react'

import type { HomeSummary } from '../types'

type HomeState = { summary: HomeSummary | null; loading: boolean }
let state: HomeState = { summary: null, loading: false }
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export const homeStore = {
  getState: () => state,
  setLoading: (loading: boolean) => { state = { ...state, loading }; notify() },
  setSummary: (summary: HomeSummary) => { state = { summary, loading: false }; notify() },
  subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
}

export function useHomeStore() {
  return useSyncExternalStore(homeStore.subscribe, homeStore.getState, homeStore.getState)
}
