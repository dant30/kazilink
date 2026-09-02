import { Check, CreditCard } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import type { SubscriptionPlan } from '../types'

export function SubscriptionPlanCard({ plan, current, processing, onChoose }: { plan: SubscriptionPlan; current: boolean; processing: boolean; onChoose: () => void }) {
  return <article className={`relative flex flex-col rounded-2xl border p-5 shadow-sm ${current ? 'border-[#FF6B00] bg-orange-50/40' : 'border-slate-200 bg-white'}`}>
    {current && <span className="absolute right-4 top-4 rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-700">Current plan</span>}
    <h2 className="text-lg font-black text-[#0A2540]">{plan.name}</h2><p className="mt-2 min-h-10 text-sm text-slate-500">{plan.description}</p>
    <p className="mt-5 text-3xl font-black text-[#0A2540]">KSh {plan.amount_ksh.toLocaleString()}<span className="text-xs font-semibold text-slate-400"> / {plan.duration_days} days</span></p>
    <div className="mt-auto pt-5">{plan.amount_ksh === 0 ? <p className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Check className="h-4 w-4 text-green-600" />No payment required</p> : <Button className="w-full" disabled={current || processing} isLoading={processing} leftIcon={<CreditCard className="h-4 w-4" />} onClick={onChoose}>{current ? 'Active plan' : 'Choose plan'}</Button>}</div>
  </article>
}
