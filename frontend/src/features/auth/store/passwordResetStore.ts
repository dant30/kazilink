import { useSyncExternalStore } from 'react'
import { confirmPasswordReset, requestPasswordReset, verifyPasswordReset } from '../services/auth'
import type { PasswordResetState } from '../types'

const initialState: PasswordResetState = { step: 'request', phone: '', resetToken: '', message: '', verificationCode: undefined, loading: false, error: '' }
let state = initialState
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())
const getError = (error: unknown) => error instanceof Error ? error.message : 'Unable to complete password reset.'

export const passwordResetStore = {
  getState: () => state,
  subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
  async request(phone: string) {
    state = { ...state, phone, loading: true, error: '', message: '' }; notify()
    try {
      const response = await requestPasswordReset(phone)
      state = { ...state, step: 'verify', loading: false, message: response.message, verificationCode: response.verification_code }
      notify()
    } catch (error) { state = { ...state, loading: false, error: getError(error) }; notify(); throw error }
  },
  async verify(code: string) {
    state = { ...state, loading: true, error: '' }; notify()
    try {
      const response = await verifyPasswordReset(state.phone, code)
      state = { ...state, step: 'confirm', resetToken: response.reset_token, loading: false, message: response.message }
      notify()
    } catch (error) { state = { ...state, loading: false, error: getError(error) }; notify(); throw error }
  },
  async confirm(newPassword: string, confirmPassword: string) {
    state = { ...state, loading: true, error: '' }; notify()
    try {
      const response = await confirmPasswordReset(state.phone, state.resetToken, newPassword, confirmPassword)
      state = { ...state, step: 'complete', loading: false, message: response.message }
      notify()
    } catch (error) { state = { ...state, loading: false, error: getError(error) }; notify(); throw error }
  },
  reset: () => { state = initialState; notify() },
}

export function usePasswordResetStore() {
  return useSyncExternalStore(passwordResetStore.subscribe, passwordResetStore.getState, passwordResetStore.getState)
}
