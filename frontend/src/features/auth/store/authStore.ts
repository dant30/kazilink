import { useSyncExternalStore } from 'react'

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../../core/api'
import { localStorageStore } from '../../../core/storage'
import type { AuthTokens, User } from '../types'

type AuthState = { user: User | null; tokens: AuthTokens | null; loading: boolean }

function readState(): AuthState {
  try {
    const access = localStorageStore.getString(ACCESS_TOKEN_KEY)
    const refresh = localStorageStore.getString(REFRESH_TOKEN_KEY)
    const user = localStorageStore.get<User | null>('user')
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
    localStorageStore.setString(ACCESS_TOKEN_KEY, tokens.access)
    localStorageStore.setString(REFRESH_TOKEN_KEY, tokens.refresh)
    localStorageStore.set('user', user)
    state = { user, tokens, loading: false }; notify()
  },
  setUser: (user: User | null) => { state = { ...state, user }; if (user) localStorageStore.set('user', user); else localStorageStore.remove('user'); notify() },
  signOut: () => { localStorageStore.remove(ACCESS_TOKEN_KEY); localStorageStore.remove(REFRESH_TOKEN_KEY); localStorageStore.remove('user'); state = { user: null, tokens: null, loading: false }; notify() },
  subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
}

export function useAuthStore() {
  return useSyncExternalStore(authStore.subscribe, authStore.getState, authStore.getState)
}
