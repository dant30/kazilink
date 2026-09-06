// frontend/src/core/api/endpoints.ts
import { del, get, patch, post } from './apiClient'
import type { Paginated } from './apiClient'
import type { User } from '../../features/auth/types'
import type { AuditLog } from '../../features/audit/types'
import type { Establishment } from '../../features/establishments/types'
import type { EmploymentRecord } from '../../features/employment_history/types'
import type { FraudAlert } from '../../features/fraud/types'
import type { Job } from '../../features/jobs/types'
import type { JobApplication } from '../../features/job_applications/types'
import type { Conversation, Message } from '../../features/messaging/types'
import type { Notification } from '../../features/notifications/types'
import type { CreditCatalogResponse, CreditLedgerEntry, CreditRecharge, CreditWalletResponse, PaymentInitiateInput, PaymentInitiateResponse, Transaction } from '../../features/payments/types'
import type { Review, ReviewUpdateInput } from '../../features/ratings/types'
import type { Subscription, SubscriptionCheckout, SubscriptionCheckoutResponse, SubscriptionPlan } from '../../features/subscriptions/types'
import type { SupportTicket } from '../../features/support/types'
import type { KPISnapshot } from '../../features/analytics/types'
import type { WorkerProfile, UpdateWorkerProfilePayload } from '../../features/workers/types'
import type { EmployerProfile, UpdateEmployerProfilePayload } from '../../features/employers/types'
import type { ReferralSummary } from '../../features/accounts/types/referrals'

export const endpoints = {
  auth: {
    login: (data: { phone: string; password: string }) => post<{ user: User; tokens: { access: string; refresh: string }}>('/accounts/login/', data),
    register: (data: Record<string, unknown>) => post('/accounts/register/', data),
    refresh: (refresh: string) => post<{ access: string }>('/accounts/token/refresh/', { refresh }),
    verifyPhone: (data: Record<string, unknown>) => post('/accounts/verify-phone/', data),
    requestPasswordReset: (data: { phone: string }) => post<{ message: string; verification_code?: string }>('/accounts/password-reset/request/', data),
    verifyPasswordReset: (data: { phone: string; code: string }) => post<{ reset_token: string; message: string }>('/accounts/password-reset/verify/', data),
    confirmPasswordReset: (data: { phone: string; reset_token: string; new_password: string; confirm_password: string }) => post<{ message: string }>('/accounts/password-reset/confirm/', data),
    me: () => get<User>('/accounts/me/'),
    updateMe: (data: Record<string, unknown>) => patch<User>('/accounts/me/', data),
    profile: () => get('/accounts/profile/'),
    updateProfile: (data: Record<string, unknown>) => patch('/accounts/profile/', data),
    employerProfile: () => get<EmployerProfile>('/accounts/employer-profile/'),
    updateEmployerProfile: (data: UpdateEmployerProfilePayload | FormData) => patch<EmployerProfile>('/accounts/employer-profile/', data),
    referrals: () => get<ReferralSummary>('/accounts/referrals/'),
    workerOccupations: () => get<{ occupations: Array<{ value: string; label: string }>; availability: Array<{ value: string; label: string }>; locations: Array<{ value: string; label: string }>; skills: Array<{ value: string; label: string }>; languages: Array<{ value: string; label: string }>; business_types: Array<{ value: string; label: string }>; job_types: Array<{ value: string; label: string }>; pay_periods: Array<{ value: string; label: string }> }>('/accounts/worker-occupations/'),
    adminUsers: () => get<Paginated<User> | User[]>('/accounts/admin/users/'),
  },
  jobs: {
    list: (query = '') => get<Paginated<Job> | Job[]>(`/jobs/${query ? `?${query}` : ''}`),
      saved: () => get<Job[]>('/jobs/saved/'),
    detail: (id: number) => get<Job>(`/jobs/${id}/`),
    create: (data: Record<string, unknown>) => post<Job>('/jobs/', data),
    update: (id: number, data: Record<string, unknown>) => patch<Job>(`/jobs/${id}/`, data),
    saveStatus: (id: number) => get<{ saved: boolean }>(`/jobs/${id}/save/`),
    save: (id: number) => post<{ saved: boolean }>(`/jobs/${id}/save/`, {}),
    unsave: (id: number) => del<{ saved: boolean }>(`/jobs/${id}/save/`),
    close: (id: number) => post<Job>(`/jobs/${id}/close/`, {}),
    recommended: () => get<Paginated<Job> | Job[]>('/jobs/recommended/'),
    adminList: () => get<Paginated<Job> | Job[]>('/jobs/admin/list/'),
    featureWithCredits: (id: number, idempotency_key: string) => post<{ job: Job; credit_entry_id: number }>(`/jobs/${id}/credits/feature/`, { idempotency_key }),
    boostWithCredits: (id: number, idempotency_key: string) => post<{ job: Job; credit_entry_id: number }>(`/jobs/${id}/credits/boost/`, { idempotency_key }),
  },
  establishments: {
    list: (query = '') => get<Paginated<Establishment> | Establishment[]>(`/establishments/${query ? `?${query}` : ''}`),
    detail: (id: number) => get<Establishment>(`/establishments/${id}/`),
    create: (data: Record<string, unknown>) => post<Establishment>('/establishments/', data),
    update: (id: number, data: Record<string, unknown>) => patch<Establishment>(`/establishments/${id}/`, data),
    verify: (id: number) => post<Establishment>(`/establishments/${id}/verify/`, {}),
    adminList: () => get<Paginated<Establishment> | Establishment[]>('/establishments/admin/list/'),
    mine: () => get<Paginated<Establishment> | Establishment[]>('/establishments/mine/'),
  },
  employmentHistory: {
    mine: () => get<Paginated<EmploymentRecord> | EmploymentRecord[]>('/employment-history/mine/'),
    create: (data: Record<string, unknown>) => post<EmploymentRecord>('/employment-history/mine/', data),
    detail: (id: number) => get<EmploymentRecord>(`/employment-history/mine/${id}/`),
    update: (id: number, data: Record<string, unknown>) => patch<EmploymentRecord>(`/employment-history/mine/${id}/`, data),
    remove: (id: number) => del<void>(`/employment-history/mine/${id}/`),
    unlock: (data: { worker_id: number; idempotency_key?: string }) => post('/employment-history/unlock/', data),
    access: () => get('/employment-history/access/'),
    consent: (consent_history_sharing: boolean) => patch('/employment-history/consent/', { consent_history_sharing }),
    worker: (workerId: number) => get(`/employment-history/worker/${workerId}/`),
    verificationQueue: () => get('/employment-history/admin/verification-queue/'),
    verify: (id: number, data: Record<string, unknown>) => patch(`/employment-history/admin/${id}/verify/`, data),
  },
  applications: {
    list: (query = '') => get<Paginated<JobApplication> | JobApplication[]>(`/applications/${query ? `?${query}` : ''}`),
    create: (data: Record<string, unknown>) => post<JobApplication>('/applications/', data),
    detail: (id: number) => get<JobApplication>(`/applications/${id}/`),
    updateStatus: (id: number, data: { status: string; interview_date?: string | null; interview_note?: string }) => patch<JobApplication>(`/applications/${id}/status/`, data),
    mine: (query = '') => get<Paginated<JobApplication> | JobApplication[]>(`/applications/mine/${query ? `?${query}` : ''}`),
    employer: (query = '') => get<Paginated<JobApplication> | JobApplication[]>(`/applications/employer/${query ? `?${query}` : ''}`),
    adminList: (query = '') => get<Paginated<JobApplication> | JobApplication[]>(`/applications/admin/list/${query ? `?${query}` : ''}`),
  },
  messaging: {
    conversations: () => get<Paginated<Conversation> | Conversation[]>('/messaging/'),
    createConversation: (data: Record<string, unknown>) => post<Conversation>('/messaging/', data),
    conversation: (id: number) => get<Conversation>(`/messaging/${id}/`),
    messages: (conversationId: number) => get<Paginated<Message> | Message[]>(`/messaging/${conversationId}/messages/`),
    sendMessage: (conversationId: number, text: string) => post<Message>(`/messaging/${conversationId}/messages/`, { text }),
    markRead: (conversationId: number) => post(`/messaging/${conversationId}/read/`, {}),
    adminList: () => get('/messaging/admin/list/'),
  },
  ratings: {
    list: (query = '') => get<Paginated<Review> | Review[]>(`/ratings/${query ? `?${query}` : ''}`),
    create: (data: Record<string, unknown>) => post<Review>('/ratings/', data),
    detail: (id: number) => get<Review>(`/ratings/${id}/`),
    adminList: () => get<Paginated<Review> | Review[]>('/ratings/admin/list/'),
    update: (id: number, data: ReviewUpdateInput) => patch<Review>(`/ratings/${id}/`, data),
    remove: (id: number) => del<void>(`/ratings/${id}/`),
  },
  notifications: {
    list: (unread = false) => get<Paginated<Notification> | Notification[]>(`/notifications/${unread ? '?unread=true' : ''}`),
    markRead: (id: number) => post<Notification>(`/notifications/${id}/read/`, {}),
    markAllRead: () => post<{ marked_read: number }>('/notifications/read-all/', {}),
    preferences: () => get('/notifications/preferences/'),
    updatePreferences: (data: Record<string, boolean>) => patch('/notifications/preferences/', data),
    adminList: () => get('/notifications/admin/list/'),
  },
  payments: {
    list: () => get<Paginated<Transaction> | Transaction[]>('/payments/'),
    detail: (id: number) => get<Transaction>(`/payments/${id}/`),
    create: (data: PaymentInitiateInput) => post<PaymentInitiateResponse>('/payments/', data),
    refund: (id: number) => post<Transaction>(`/payments/${id}/refund/`, {}),
    adminList: () => get<Paginated<Transaction> | Transaction[]>('/payments/admin/list/'),
  },
  credits: {
    catalog: () => get<CreditCatalogResponse>('/credits/catalog/'),
    wallet: () => get<CreditWalletResponse>('/credits/wallet/'),
    recharge: (data: { amount_ksh: number; phone_number?: string }) => post<CreditRecharge>('/credits/recharge/', data),
    rechargeStatus: (id: number) => get<CreditRecharge>(`/credits/recharge/${id}/`),
    spend: (data: { action: string; reference?: string; idempotency_key: string; metadata?: Record<string, unknown> }) => post('/credits/spend/', data),
    transfer: (data: { recipient_phone: string; amount: number; idempotency_key: string }) => post<CreditLedgerEntry>('/credits/transfer/', data),
  },
  subscriptions: {
    list: () => get<Paginated<Subscription> | Subscription[]>('/subscriptions/'),
    plans: () => get<SubscriptionPlan[]>('/subscriptions/plans/'),
    checkout: (data: SubscriptionCheckout) => post<SubscriptionCheckoutResponse>('/subscriptions/checkout/', data),
    cancel: (id: number) => post<Subscription>(`/subscriptions/${id}/cancel/`, {}),
    adminList: () => get<Paginated<Subscription> | Subscription[]>('/subscriptions/admin/list/'),
  },
  support: {
    list: () => get<Paginated<SupportTicket> | SupportTicket[]>('/support/'),
    create: (data: { subject: string; description: string }) => post<SupportTicket>('/support/', data),
    detail: (id: number) => get<SupportTicket>(`/support/${id}/`),
    close: (id: number) => post<SupportTicket>(`/support/${id}/close/`, {}),
    staffUpdate: (id: number, data: { status?: string; assigned_to_id?: number | null }) => patch<SupportTicket>(`/support/admin/${id}/`, data),
    adminList: () => get<Paginated<SupportTicket> | SupportTicket[]>('/support/admin/list/'),
  },
  analytics: {
    list: (query = '') => get<Paginated<KPISnapshot> | KPISnapshot[]>(`/analytics/${query ? `?${query}` : ''}`),
    adminList: () => get<Paginated<KPISnapshot> | KPISnapshot[]>('/analytics/admin/list/'),
    latest: () => get<KPISnapshot>('/analytics/latest/'),
    generate: (data: { period_start: string; period_end: string }) => post<KPISnapshot>('/analytics/generate/', data),
    detail: (id: number) => get<KPISnapshot>(`/analytics/${id}/`),
    export: (id: number) => get<Blob>(`/analytics/${id}/export/`, { responseType: 'blob' }),
  },
  audit: { list: (query = '') => get<Paginated<AuditLog> | AuditLog[]>(`/audit/${query ? `?${query}` : ''}`), detail: (id: number) => get<AuditLog>(`/audit/${id}/`), adminList: () => get<Paginated<AuditLog> | AuditLog[]>('/audit/admin/list/') },
  fraud: { list: (query = '') => get<Paginated<FraudAlert> | FraudAlert[]>(`/fraud/${query ? `?${query}` : ''}`), detail: (id: number) => get<FraudAlert>(`/fraud/${id}/`), updateStatus: (id: number, status: 'resolved' | 'dismissed') => post<FraudAlert>(`/fraud/${id}/status/`, { status }) },
  workers: {
    me: () => get<WorkerProfile>('/workers/me/'),
    update: (data: UpdateWorkerProfilePayload | FormData) => patch<WorkerProfile>('/workers/me/', data),
    boostProfileWithCredits: (idempotency_key: string) => post<{ profile: WorkerProfile; credit_entry_id: number }>('/workers/me/credits/boost/', { idempotency_key }),
    detail: (id: number) => get<WorkerProfile>(`/workers/${id}/`),
    list: (query = '') => get<Paginated<WorkerProfile> | WorkerProfile[]>(`/workers/${query ? `?${query}` : ''}`),
  },
}