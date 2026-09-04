import { endpoints } from '../../../core/api'
import type { LoginResponse, RegisterPayload } from '../types'

export function login(phone: string, password: string) {
  return endpoints.auth.login({ phone, password }) as Promise<LoginResponse>
}

export function register(data: RegisterPayload) {
  return endpoints.auth.register(data) as Promise<{ user: LoginResponse['user']; message: string; verification_code?: string }>
}

export function verifyPhone(phone: string, code: string) {
  return endpoints.auth.verifyPhone({ phone, code }) as Promise<LoginResponse>
}

export function requestPasswordReset(phone: string) {
  return endpoints.auth.requestPasswordReset({ phone })
}

export function verifyPasswordReset(phone: string, code: string) {
  return endpoints.auth.verifyPasswordReset({ phone, code })
}

export function confirmPasswordReset(phone: string, resetToken: string, newPassword: string, confirmPassword: string) {
  return endpoints.auth.confirmPasswordReset({ phone, reset_token: resetToken, new_password: newPassword, confirm_password: confirmPassword })
}

export function loadCurrentUser() {
  return endpoints.auth.me()
}
