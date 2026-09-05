export type ReferralItem = {
  id: number
  referred_name: string
  status: string
  referred_reward: number
  created_at: string
  rewarded_at: string | null
}

export type ReferralSummary = {
  code: string
  pending: number
  rewarded: number
  credits_earned: number
  referrals: ReferralItem[]
}
