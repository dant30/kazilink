export type AuthTokens = { access: string; refresh: string }
export type User = { id: number; phone: string; email?: string | null; full_name: string; is_worker: boolean; is_employer: boolean; is_staff: boolean; is_superuser?: boolean }
export type LoginResponse = { user: User; tokens: AuthTokens }
export type RegisterPayload = Record<string, unknown>
export type PasswordResetStep = 'request' | 'verify' | 'confirm' | 'complete'
export type PasswordResetState = { step: PasswordResetStep; phone: string; resetToken: string; message: string; verificationCode?: string; loading: boolean; error: string }
export type VerificationDocument = { id: number; document_type: 'national_id' | 'good_conduct'; document: string; status: 'pending' | 'verified' | 'rejected'; notes: string; reviewed_at: string | null; created_at: string; updated_at: string }
