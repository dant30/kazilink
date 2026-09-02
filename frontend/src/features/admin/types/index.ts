export type AdminRole = 'staff' | 'superuser'
export type AdminResource = 'users' | 'jobs' | 'applications' | 'audit' | 'fraud' | 'analytics' | 'support' | 'payments' | 'subscriptions'

export type AdminUserListResponse = import('../../auth/types').User[] | { count: number; next: string | null; previous: string | null; results: import('../../auth/types').User[] }
