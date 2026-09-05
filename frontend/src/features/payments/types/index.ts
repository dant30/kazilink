export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded' | (string & {})
export type Transaction = { id: number; employer: number; employer_name: string; transaction_type: string; amount_ksh: number; status: TransactionStatus; provider: string; provider_reference: string; metadata: Record<string, unknown>; created_at: string; completed_at: string | null }
export type PaymentInitiateInput = { transaction_type: string; amount_ksh: number; phone_number?: string; metadata?: Record<string, unknown> }
export type PaymentInitiateResponse = { transaction: Transaction; provider: Record<string, unknown> }
export type TransactionListResponse = Transaction[] | { count: number; next: string | null; previous: string | null; results: Transaction[] }
export type { CreditAction, CreditCatalogResponse, CreditLedgerEntry, CreditRecharge, CreditWallet, CreditWalletResponse } from './credits'
