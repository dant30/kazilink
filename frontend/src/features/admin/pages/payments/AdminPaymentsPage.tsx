import { useMemo, useState } from 'react'
import { CheckCircle2, Clock3, CreditCard, Filter, Search, XCircle } from 'lucide-react'
import { DataTable } from '../../../../shared/components/tables'
import { StatCard } from '../../../../shared/components/cards/StatCard'
import { Badge } from '../../../../shared/components/ui/Badge'
import { PageHeader } from '../../../../shared/components/ui/PageHeader'
import { Select } from '../../../../shared/components/ui/Select'
import { Skeleton } from '../../../../shared/components/ui/Skeleton'
import { ErrorBoundary } from '../../../../shared/components/ui/ErrorBoundary'
import { useAdminPayments } from '../../hooks/useAdminPayments'
import type { Transaction } from '../../../payments/types'

const transactionLabels: Record<string, string> = {
  history_unlock: 'History unlock',
  bundle: 'Profile unlock bundle',
  featured_job: 'Featured job',
  subscription: 'Subscription',
}

const statusVariant = (value: string): 'success' | 'warning' | 'info' | 'neutral' => value === 'completed' ? 'success' : value === 'pending' ? 'warning' : value === 'failed' ? 'info' : 'neutral'

export function AdminPaymentsPage() {
  const { transactions, loading, error } = useAdminPayments()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const filtered = useMemo(() => transactions.filter((transaction) => (!status || transaction.status === status) && `${transaction.employer_name} ${transaction.provider_reference} ${transaction.transaction_type}`.toLowerCase().includes(query.toLowerCase())), [query, status, transactions])
  const statusOptions = [{ value: '', label: 'All statuses' }, { value: 'pending', label: 'Pending' }, { value: 'completed', label: 'Completed' }, { value: 'failed', label: 'Failed' }, { value: 'refunded', label: 'Refunded' }]
  const totalCompleted = transactions.filter((transaction) => transaction.status === 'completed').reduce((sum, transaction) => sum + transaction.amount_ksh, 0)
  return (
    <ErrorBoundary>
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Finance operations"
        title="Payment transactions"
        description="Monitor employer payments and M-Pesa transaction outcomes."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Transactions" value={transactions.length} subtitle="Payments recorded" icon={<CreditCard className="h-5 w-5" />} />
        <StatCard title="Completed value" value={`KSh ${totalCompleted.toLocaleString()}`} subtitle="Successful payment volume" icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" />
        <StatCard title="Pending" value={transactions.filter((transaction) => transaction.status === 'pending').length} subtitle="Awaiting provider outcome" icon={<Clock3 className="h-5 w-5" />} iconBg="bg-amber-50 text-amber-600" />
      </div><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-lg font-black text-slate-900">Transaction ledger</h2><p className="text-sm text-slate-500">Search by employer, payment type, or provider reference.</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search transactions" className="w-full bg-transparent outline-none sm:w-56" /></label><div className="flex items-center gap-2"><Filter className="h-4 w-4 text-slate-400" /><Select value={status} onChange={setStatus} options={statusOptions} className="flex-1" /></div></div></div>{error && <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}{loading ? <p className="p-8 text-center text-sm text-slate-500">Loading transactions...</p> : <DataTable data={filtered} keyExtractor={(transaction) => String(transaction.id)} emptyMessage="No transactions match the current filters." columns={[{ header: 'Employer', render: (transaction) => <div><p className="font-bold text-slate-900">{transaction.employer_name}</p><p className="text-xs text-slate-500">Employer #{transaction.employer}</p></div> }, { header: 'Purpose', render: (transaction) => transactionLabels[transaction.transaction_type] || transaction.transaction_type.replace(/_/g, ' ') }, { header: 'Amount', render: (transaction) => <span className="font-bold text-slate-900">KSh {transaction.amount_ksh.toLocaleString()}</span> }, { header: 'Status', render: (transaction) => <Badge variant={statusVariant(transaction.status)} icon={transaction.status === 'completed' ? <CheckCircle2 className="h-3 w-3" /> : transaction.status === 'failed' ? <XCircle className="h-3 w-3" /> : undefined}>{transaction.status}</Badge> }, { header: 'Provider reference', render: (transaction) => transaction.provider_reference || 'Pending provider reference' }, { header: 'Created', render: (transaction) => new Date(transaction.created_at).toLocaleString() }]} />}</section></section>
      </ErrorBoundary>
  )
}
