import { useSyncExternalStore } from 'react'

import type { JobApplication } from '../types'

type ApplicationsState = {
  applications: JobApplication[]
  selectedApplication: JobApplication | null
  loading: boolean
  error: string
}

let state: ApplicationsState = {
  applications: [],
  selectedApplication: null,
  loading: false,
  error: '',
}

const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export const applicationsStore = {
  getState: () => state,
  setApplications: (applications: JobApplication[]) => {
    state = { ...state, applications }
    notify()
  },
  setSelectedApplication: (selectedApplication: JobApplication | null) => {
    state = { ...state, selectedApplication }
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
    state = { applications: [], selectedApplication: null, loading: false, error: '' }
    notify()
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useApplicationsStore() {
  return useSyncExternalStore(applicationsStore.subscribe, applicationsStore.getState, applicationsStore.getState)
}

