export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | (string & {})
export type Subscription = { id: number; employer: number; employer_name: string; plan: string; status: SubscriptionStatus; started_at: string; expires_at: string; auto_renew: boolean; provider_reference: string }
export type SubscriptionPlan = { code: string; name: string; amount_ksh: number; duration_days: number; description: string }
export type SubscriptionCheckout = { plan: string; phone_number: string }
export type SubscriptionCheckoutResponse = { payment_id: number; status: string; provider: Record<string, unknown> }
