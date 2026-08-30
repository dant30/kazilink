import { useSyncExternalStore } from 'react'

import type { Job, JobFilters } from '../types'

type JobsState = {
  jobs: Job[]
  selectedJob: Job | null
  filters: JobFilters
  loading: boolean
  error: string
}

const initialFilters: JobFilters = { q: '', location: '', category: '', job_type: '' }

let state: JobsState = {
  jobs: [],
  selectedJob: null,
  filters: initialFilters,
  loading: false,
  error: '',
}

const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export const jobsStore = {
  getState: () => state,
  setJobs: (jobs: Job[]) => {
    state = { ...state, jobs }
    notify()
  },
  setSelectedJob: (selectedJob: Job | null) => {
    state = { ...state, selectedJob }
    notify()
  },
  setFilters: (filters: Partial<JobFilters>) => {
    state = { ...state, filters: { ...state.filters, ...filters } }
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
    state = {
      jobs: [],
      selectedJob: null,
      filters: initialFilters,
      loading: false,
      error: '',
    }
    notify()
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useJobsStore() {
  return useSyncExternalStore(jobsStore.subscribe, jobsStore.getState, jobsStore.getState)
}