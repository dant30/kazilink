import { useEffect, useState } from 'react'
import { Coins, RefreshCw } from 'lucide-react'
import { endpoints } from '../../../core/api'
import { toast } from '../../../shared/components/feedback'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import type { CreditCatalogResponse, CreditWalletResponse } from '../types'

type CreditWalletPanelProps = { phone?: string; role: 'employer' | 'worker' }

export function CreditWalletPanel({ phone, role }: CreditWalletPanelProps) {
  const [wallet, setWallet] = useState<CreditWalletResponse | null>(null)
  const [catalog, setCatalog] = useState<CreditCatalogResponse | null>(null)
  const [amount, setAmount] = useState(100)
  const [phoneNumber, setPhoneNumber] = useState(phone || '')
  const [loading, setLoading] = useState(true)
  const [recharging, setRecharging] = useState(false)

  const refresh = async () => {
    setLoading(true)
    try {
      const [walletResponse, catalogResponse] = await Promise.all([endpoints.credits.wallet(), endpoints.credits.catalog()])
      setWallet(walletResponse)
      setCatalog(catalogResponse)
    } catch (error) {
      toast.error('Credits unavailable', error instanceof Error ? error.message : 'Unable to load your Kazi Credits.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void refresh() }, [])

  const recharge = async () => {
    setRecharging(true)
    try {
      const rate = catalog?.ksh_per_credit || 20
      await endpoints.credits.recharge({ amount_ksh: amount, phone_number: phoneNumber || undefined })
      toast.success('Recharge requested', `Complete the M-Pesa prompt to receive ${Math.floor(amount / rate)} Kazi Credits.`)
    } catch (error) {
      toast.error('Recharge failed', error instanceof Error ? error.message : 'Unable to start the recharge.')
    } finally {
      setRecharging(false)
    }
  }

  const visibleActions = catalog?.actions.filter((item) => item.roles.includes(role)) || []
  const rate = catalog?.ksh_per_credit || 20

  return <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B00]">Kazi Credits</p><h2 className="mt-1 text-xl font-black text-[#0A2540]">Wallet and platform boosts</h2><p className="mt-1 text-sm text-slate-500">Recharge once and spend credits on premium platform actions.</p></div><Button variant="ghost" size="sm" onClick={() => void refresh()} disabled={loading} leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button></div>
    <div className="flex items-center gap-4 rounded-xl bg-[#0A2540] p-4 text-white"><Coins className="h-8 w-8 text-[#FF6B00]" /><div><p className="text-xs uppercase tracking-wider text-slate-300">Available balance</p><p className="text-3xl font-black">{loading ? '...' : wallet?.wallet.balance ?? 0}</p></div><span className="text-sm text-slate-300">credits</span></div>
    <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end"><label className="text-sm font-semibold text-slate-700">Recharge amount (KSh)<Input type="number" min={rate} step={rate} value={amount} onChange={(event) => setAmount(Number(event.target.value))} /></label><label className="text-sm font-semibold text-slate-700">M-Pesa phone number<Input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="2547XXXXXXXX" /></label><Button onClick={() => void recharge()} disabled={recharging || amount < rate || amount % rate !== 0}>{recharging ? 'Starting...' : 'Recharge wallet'}</Button></div>
    <div><h3 className="mb-2 text-sm font-black text-[#0A2540]">What credits can unlock</h3><div className="grid gap-2 sm:grid-cols-2">{visibleActions.map((item) => <div key={item.key} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"><span>{item.label}</span><strong className="text-[#FF6B00]">{item.credits} credit{item.credits === 1 ? '' : 's'}</strong></div>)}</div></div>
  </section>
}
