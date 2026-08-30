import { useSyncExternalStore } from 'react'

import type { Establishment } from '../types'

type EstablishmentsState = {
  establishments: Establishment[]
  selectedEstablishment: Establishment | null
  loading: boolean
  error: string
}

let state: EstablishmentsState = {
  establishments: [],
  selectedEstablishment: null,
  loading: false,
  error: '',
}

const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export const establishmentsStore = {
  getState: () => state,
  setEstablishments: (establishments: Establishment[]) => {
    state = { ...state, establishments }
    notify()
  },
  setSelectedEstablishment: (selectedEstablishment: Establishment | null) => {
    state = { ...state, selectedEstablishment }
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
    state = { establishments: [], selectedEstablishment: null, loading: false, error: '' }
    notify()
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useEstablishmentsStore() {
  return useSyncExternalStore(establishmentsStore.subscribe, establishmentsStore.getState, establishmentsStore.getState)
}

