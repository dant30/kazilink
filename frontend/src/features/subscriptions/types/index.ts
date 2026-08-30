export type Subscription = { id: number; employer: number; employer_name: string; plan: string; status: string; started_at: string; expires_at: string; auto_renew: boolean; provider_reference: string }
export type SubscriptionCheckout = { plan: string; amount_ksh: number; duration_days: number; phone_number: string }
