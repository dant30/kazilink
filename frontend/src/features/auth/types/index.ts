export type AuthTokens = { access: string; refresh: string }
export type User = { id: number; phone: string; email?: string | null; full_name: string; is_worker: boolean; is_employer: boolean; is_staff: boolean; is_superuser?: boolean }
export type LoginResponse = { user: User; tokens: AuthTokens }
export type RegisterPayload = Record<string, unknown>
