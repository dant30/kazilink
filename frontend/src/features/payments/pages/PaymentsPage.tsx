import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Briefcase, CreditCard, History, RefreshCw, Send, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from '../../../shared/components/ui/Button'
import { Modal } from '../../../shared/components/ui/Modal'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { StatCard } from '../../../shared/components/cards/StatCard'
import { EmptyState } from '../../../shared/components/feedback'
import { endpoints } from '../../../core/api'
import { useAuthStore } from '../../auth/store'
import { CreditRechargeForm, CreditTransferForm, CreditWalletPanel, TransactionCard } from '../components'
import { usePayments } from '../hooks/usePayments'
import type { CreditLedgerEntry } from '../types'

export function PaymentsPage() {
  const { user } = useAuthStore()
  const location = useLocation()
  const isEmployer = Boolean(user?.is_employer && !user?.is_worker)
  const { transactions, loading, initialized, error, notice, refresh, refundPayment } = usePayments({ enabled: isEmployer })
  const [refundingId, setRefundingId] = useState<number | null>(null)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [walletRefreshToken, setWalletRefreshToken] = useState(0)
  const [transferOpen, setTransferOpen] = useState(false)
  const [creditBalance, setCreditBalance] = useState<number | null>(null)
  const [creditLedger, setCreditLedger] = useState<CreditLedgerEntry[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 8
  const visibleTransactions = transactions.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if ((location.state as { openRecharge?: boolean } | null)?.openRecharge) {
      setPaymentOpen(true)
    }
  }, [location.state])

  useEffect(() => {
    if (isEmployer) return
    endpoints.credits.wallet().then((response) => setCreditLedger(response.ledger)).catch(() => setCreditLedger([]))
  }, [isEmployer])

  const workerCreditsSpent = creditLedger.filter((entry) => entry.amount < 0).reduce((sum, entry) => sum + Math.abs(entry.amount), 0)

  const refund = async (id: number) => {
    setRefundingId(id)
    try {
      await refundPayment(id)
    } finally {
      setRefundingId(null)
    }
  }

  if (!isEmployer) {
    return <section className="mx-auto max-w-5xl space-y-6 px-3.5 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8"><PageHeader eyebrow="Worker Wallet" title={`Credit balance: ${creditBalance ?? '...'} Kazi Credits`} description="Manage credits for applications, profile boosts, and premium opportunities." actions={<div className="flex flex-wrap gap-2"><Button onClick={() => setTransferOpen(true)} variant="outline" leftIcon={<Send className="h-4 w-4" />}>Transfer credits</Button><Button onClick={() => setPaymentOpen(true)} leftIcon={<CreditCard className="h-4 w-4" />}>Recharge</Button></div>} /><div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3"><StatCard title="Total spent" value={`${workerCreditsSpent} Credits`} subtitle="Completed credit actions" icon={<TrendingUp className="h-4 w-4" />} /><StatCard title="Transactions" value={creditLedger.length} subtitle="Wallet movements" icon={<History className="h-4 w-4" />} /><StatCard title="Profile activity" value={user?.is_worker ? 'Active' : 'Ready'} subtitle="Premium actions enabled" icon={<Briefcase className="h-4 w-4" />} iconBg="bg-orange-50 text-[#FF6B00]" /></div><CreditWalletPanel role="worker" refreshToken={walletRefreshToken} onBalanceChange={setCreditBalance} /><section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6"><div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-4"><div><h2 className="text-lg font-black text-[#0A2540]">Transaction history</h2><p className="text-xs text-slate-500">Your Kazi Credit movements and wallet activity.</p></div><History className="h-5 w-5 text-[#FF6B00]" /></div>{creditLedger.length ? <div className="divide-y divide-slate-100">{creditLedger.slice(0, 20).map((entry) => <div key={entry.id} className="flex items-center gap-3 py-3 text-sm"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${entry.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-[#FF6B00]'}`}>{entry.amount > 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}</span><div className="min-w-0 flex-1"><p className="truncate font-semibold capitalize text-slate-700">{entry.action.replace(/_/g, ' ')}</p><p className="text-xs text-slate-400">{new Date(entry.created_at).toLocaleString()}</p></div><strong className={entry.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}>{entry.amount > 0 ? '+' : ''}{entry.amount} Credits</strong></div>)}</div> : <EmptyState title="No credit transactions yet" description="Recharge or spend Kazi Credits to see your wallet activity here." icon={<History className="h-8 w-8" />} size="sm" />}</section><Modal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} title="Recharge Kazi Credits" subtitle="Complete the M-Pesa prompt to add credits to your wallet." maxWidth="md"><CreditRechargeForm defaultPhone={user?.phone} onComplete={() => { setWalletRefreshToken((value) => value + 1); setPaymentOpen(false) }} onCancel={() => setPaymentOpen(false)} /></Modal><Modal isOpen={transferOpen} onClose={() => setTransferOpen(false)} title="Transfer Kazi Credits" subtitle="Send credits to another KaziLink account." maxWidth="md"><CreditTransferForm balance={creditBalance ?? 0} onComplete={() => { setWalletRefreshToken((value) => value + 1); setTransferOpen(false) }} /></Modal></section>
  }

  const totalSpent = transactions.filter((transaction) => transaction.status === 'completed').reduce((sum, transaction) => sum + Number(transaction.amount_ksh || 0), 0)

  return <section className="mx-auto max-w-6xl space-y-6 px-3.5 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
    <PageHeader eyebrow="Kazi Credits" title={`Credit balance: ${creditBalance ?? '...'} Kazi Credits`} description="Recharge credits for premium hiring actions and job visibility." actions={<div className="flex flex-wrap gap-2"><Button onClick={() => setTransferOpen(true)} variant="outline" leftIcon={<Send className="h-4 w-4" />}>Transfer credits</Button><Button onClick={() => setPaymentOpen(true)} leftIcon={<CreditCard className="h-4 w-4" />}>Recharge</Button></div>} />
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3"><StatCard title="Total spent" value={`KSh ${totalSpent.toLocaleString()}`} subtitle="Completed transactions" icon={<TrendingUp className="h-4 w-4" />} /><StatCard title="Transactions" value={transactions.length} subtitle="Payment records" icon={<History className="h-4 w-4" />} /><StatCard title="Hiring activity" value={user?.is_employer ? 'Active' : 'Ready'} subtitle="Premium actions enabled" icon={<Briefcase className="h-4 w-4" />} iconBg="bg-orange-50 text-[#FF6B00]" /></div>
    <CreditWalletPanel role="employer" refreshToken={walletRefreshToken} onBalanceChange={setCreditBalance} />
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
    {notice && <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">{notice}</div>}
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-lg font-black text-[#0A2540]">Transaction history</h2><p className="text-sm text-slate-500">Payments initiated from your employer account.</p></div><Button variant="ghost" size="sm" onClick={() => void refresh()} disabled={loading} leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button></div>
      {loading && !initialized ? <div className="space-y-3 py-10" aria-label="Loading transactions" aria-busy="true"><Skeleton className="h-24 w-full rounded-2xl" /><Skeleton className="h-24 w-full rounded-2xl" /><Skeleton className="h-24 w-full rounded-2xl" /></div> : transactions.length ? <><div className="space-y-3">{visibleTransactions.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} onRefund={refund} refunding={refundingId === transaction.id} />)}</div><Pagination page={page} pageSize={pageSize} total={transactions.length} onPageChange={setPage} className="mt-4" /></> : <EmptyState title="No transactions yet" description="Your employer payment history will appear here." icon={<CreditCard className="h-8 w-8" />} size="sm" />}
    </section>
    <Modal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} title="Recharge Kazi Credits" subtitle="Complete the M-Pesa prompt to add credits to your wallet." maxWidth="md"><CreditRechargeForm defaultPhone={user?.phone} onComplete={() => { setWalletRefreshToken((value) => value + 1); setPaymentOpen(false) }} onCancel={() => setPaymentOpen(false)} /></Modal>
    <Modal isOpen={transferOpen} onClose={() => setTransferOpen(false)} title="Transfer Kazi Credits" subtitle="Send credits to another KaziLink account." maxWidth="md"><CreditTransferForm balance={creditBalance ?? 0} onComplete={() => { setWalletRefreshToken((value) => value + 1); setTransferOpen(false) }} /></Modal>
  </section>
}
