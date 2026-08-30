import { useSyncExternalStore } from 'react'

import type { EmploymentRecord } from '../types'

type EmploymentHistoryState = {
  records: EmploymentRecord[]
  selectedRecord: EmploymentRecord | null
  loading: boolean
  error: string
}

let state: EmploymentHistoryState = {
  records: [],
  selectedRecord: null,
  loading: false,
  error: '',
}

const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export const employmentHistoryStore = {
  getState: () => state,
  setRecords: (records: EmploymentRecord[]) => {
    state = { ...state, records }
    notify()
  },
  setSelectedRecord: (selectedRecord: EmploymentRecord | null) => {
    state = { ...state, selectedRecord }
    notify()
  },
  setLoading: (loading: boolean) => {
    state = { ...state, loading }
    notify()
  },
  setError: (error: string) => {
    state = { ...state, error }
    notify()
  },
  clear: () => {
    state = { records: [], selectedRecord: null, loading: false, error: '' }
    notify()
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useEmploymentHistoryStore() {
  return useSyncExternalStore(employmentHistoryStore.subscribe, employmentHistoryStore.getState, employmentHistoryStore.getState)
}

