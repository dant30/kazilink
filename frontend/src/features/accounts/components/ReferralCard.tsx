import { useEffect, useState } from 'react'
import { Check, Copy, Gift, RefreshCw } from 'lucide-react'
import { endpoints } from '../../../core/api'
import { toast } from '../../../shared/components/feedback'
import { Badge } from '../../../shared/components/ui/Badge'
import { Button } from '../../../shared/components/ui/Button'
import type { ReferralSummary } from '../types/referrals'

export function ReferralCard() {
  const [summary, setSummary] = useState<ReferralSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      setSummary(await endpoints.auth.referrals())
    } catch (error) {
      toast.error('Referrals unavailable', error instanceof Error ? error.message : 'Unable to load your referral details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const copyCode = async () => {
    if (!summary?.code) return
    try {
      await navigator.clipboard.writeText(summary.code)
      setCopied(true)
      toast.success('Referral code copied', 'Share it with someone joining KaziLink.')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Copy failed', 'Select and copy the referral code manually.')
    }
  }

  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><Gift className="h-5 w-5 text-[#FF6B00]" /><h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">Refer and earn</h3></div><p className="mt-2 text-sm text-slate-500">Invite someone to KaziLink. You earn 5 credits and they receive 2 after phone verification.</p></div><Button variant="ghost" size="sm" onClick={() => void load()} disabled={loading} aria-label="Refresh referrals" title="Refresh referrals" leftIcon={<RefreshCw className="h-4 w-4" />} /></div><div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3"><span className="flex-1 font-mono text-sm font-bold tracking-wider text-[#0A2540]">{loading ? 'Loading...' : summary?.code || 'Unavailable'}</span><Button variant="ghost" size="sm" onClick={() => void copyCode()} disabled={!summary?.code} aria-label="Copy referral code" title="Copy referral code" leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} /></div><div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="rounded-lg bg-slate-50 p-2"><p className="text-lg font-black text-[#0A2540]">{summary?.pending ?? 0}</p><p className="text-[11px] text-slate-500">Pending</p></div><div className="rounded-lg bg-slate-50 p-2"><p className="text-lg font-black text-[#0A2540]">{summary?.rewarded ?? 0}</p><p className="text-[11px] text-slate-500">Rewarded</p></div><div className="rounded-lg bg-slate-50 p-2"><p className="text-lg font-black text-[#FF6B00]">{summary?.credits_earned ?? 0}</p><p className="text-[11px] text-slate-500">Credits</p></div></div>{summary?.referrals.length ? <div className="mt-4 space-y-2"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent referrals</p>{summary.referrals.slice(0, 3).map((referral) => <div key={referral.id} className="flex items-center justify-between gap-3 text-sm"><span className="truncate text-slate-700">{referral.referred_name}</span><Badge size="sm" variant={referral.status === 'rewarded' ? 'success' : 'warning'}>{referral.status}</Badge></div>)}</div> : null}</section>
}
