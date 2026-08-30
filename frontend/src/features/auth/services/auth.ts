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

export function loadCurrentUser() {
  return endpoints.auth.me()
}
