import { useEffect, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react'
import { endpoints } from '../../../core/api'
import { EmptyState, toast } from '../../../shared/components/feedback'
import { Button } from '../../../shared/components/ui/Button'
import type { CreditCatalogResponse, CreditWalletResponse } from '../types'

type CreditWalletPanelProps = { role: 'employer' | 'worker'; refreshToken?: number; onBalanceChange?: (balance: number) => void }

export function CreditWalletPanel({ role, refreshToken = 0, onBalanceChange }: CreditWalletPanelProps) {
  const [wallet, setWallet] = useState<CreditWalletResponse | null>(null)
  const [catalog, setCatalog] = useState<CreditCatalogResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    setLoading(true)
    try {
      const [walletResponse, catalogResponse] = await Promise.all([endpoints.credits.wallet(), endpoints.credits.catalog()])
      setWallet(walletResponse)
      onBalanceChange?.(walletResponse.wallet.balance)
      setCatalog(catalogResponse)
    } catch (error) {
      toast.error('Credits unavailable', error instanceof Error ? error.message : 'Unable to load your Kazi Credits.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void refresh() }, [refreshToken])

  const visibleActions = catalog?.actions.filter((item) => item.roles.includes(role)) || []

  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-5 flex items-center justify-end">
      <Button variant="ghost" size="sm" onClick={() => void refresh()} disabled={loading} leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button>
    </div>
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-[#0A2540]">What credits can unlock</h3>
            <p className="mt-1 text-xs text-slate-500">Premium actions for your account.</p>
          </div>
          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#C2410C]">Catalog</span>
        </div>
        <div className="space-y-2">
          {visibleActions.map((item) => <div key={item.key} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm"><span className="font-medium text-slate-700">{item.label}</span><strong className="shrink-0 text-[#FF6B00]">{item.credits} credit{item.credits === 1 ? '' : 's'}</strong></div>)}
          {!loading && visibleActions.length === 0 && <EmptyState size="sm" title="No actions available" description="Premium actions for this account will appear here." className="rounded-lg border border-dashed border-slate-300" />}
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-[#0A2540]">Recent credit activity</h3>
            <p className="mt-1 text-xs text-slate-500">Your latest credit movements.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">Ledger</span>
        </div>
        <div className="divide-y divide-slate-100 rounded-lg border border-slate-100">
          {wallet?.ledger.slice(0, 10).map((entry) => <div key={entry.id} className="flex items-center gap-3 px-3 py-3 text-sm"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${entry.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-[#FF6B00]'}`}>{entry.amount > 0 ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}</span><span className="min-w-0 flex-1 truncate text-slate-600">{entry.action.replace(/_/g, ' ')}</span><strong className={entry.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}>{entry.amount > 0 ? '+' : ''}{entry.amount}</strong></div>)}
          {!loading && wallet?.ledger.length === 0 && <EmptyState size="sm" title="No credit activity" description="Your credit movements will appear here." />}
        </div>
      </section>
    </div>
  </section>
}
