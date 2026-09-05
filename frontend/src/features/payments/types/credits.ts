export type CreditWallet = { balance: number; updated_at: string }
export type CreditLedgerEntry = { id: number; entry_type: string; amount: number; balance_before: number; balance_after: number; action: string; reference: string; metadata: Record<string, unknown>; created_at: string }
export type CreditWalletResponse = { wallet: CreditWallet; ledger: CreditLedgerEntry[] }
export type CreditAction = { key: string; label: string; credits: number; roles: string[] }
export type CreditCatalogResponse = { currency: string; ksh_per_credit: number; actions: CreditAction[] }
export type CreditRecharge = { id: number; amount_ksh: number; credits: number; phone_number: string; status: string; provider_reference: string; created_at: string; completed_at: string | null }
