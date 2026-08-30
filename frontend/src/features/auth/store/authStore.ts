import { useSyncExternalStore } from 'react'

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../../core/api'
import type { AuthTokens, User } from '../types'

type AuthState = { user: User | null; tokens: AuthTokens | null; loading: boolean }

function readState(): AuthState {
  try {
    const access = localStorage.getItem(ACCESS_TOKEN_KEY)
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY)
    const user = JSON.parse(localStorage.getItem('kazilink.user') ?? 'null') as User | null
    return { user, tokens: access && refresh ? { access, refresh } : null, loading: false }
  } catch {
    return { user: null, tokens: null, loading: false }
  }
}

let state = readState()
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export const authStore = {
  getState: () => state,
  setSession: (user: User, tokens: AuthTokens) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh)
    localStorage.setItem('kazilink.user', JSON.stringify(user))
    state = { user, tokens, loading: false }; notify()
  },
  setUser: (user: User | null) => { state = { ...state, user }; if (user) localStorage.setItem('kazilink.user', JSON.stringify(user)); notify() },
  signOut: () => { localStorage.removeItem(ACCESS_TOKEN_KEY); localStorage.removeItem(REFRESH_TOKEN_KEY); localStorage.removeItem('kazilink.user'); state = { user: null, tokens: null, loading: false }; notify() },
  subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
}

export function useAuthStore() {
  return useSyncExternalStore(authStore.subscribe, authStore.getState, authStore.getState)
}
