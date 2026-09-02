import { CalendarDays, XCircle } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { Badge } from '../../../shared/components/ui/Badge'
import type { Subscription } from '../types'

export function SubscriptionHistory({ subscriptions, processing, onCancel }: { subscriptions: Subscription[]; processing: boolean; onCancel: (id: number) => Promise<unknown> }) {
  if (!subscriptions.length) return <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No subscription history yet.</p>
  return <div className="space-y-3">{subscriptions.map((subscription) => <div key={subscription.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><p className="font-bold capitalize text-slate-900">{subscription.plan.replace('_', ' ')}</p><Badge variant={subscription.status === 'active' ? 'success' : 'warning'}>{subscription.status}</Badge></div><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><CalendarDays className="h-3.5 w-3.5" />Expires {new Date(subscription.expires_at).toLocaleDateString()}</p></div>{subscription.status === 'active' && <Button variant="outline" size="sm" disabled={processing} onClick={() => onCancel(subscription.id)} leftIcon={<XCircle className="h-4 w-4" />}>Cancel</Button>}</div>)}</div>
}
