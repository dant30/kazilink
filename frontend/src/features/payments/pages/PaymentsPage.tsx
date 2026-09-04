import { useState } from 'react'
import { CreditCard, RefreshCw } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { Modal } from '../../../shared/components/ui/Modal'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { useAuthStore } from '../../auth/store'
import { PaymentForm, TransactionCard } from '../components'
import { usePayments } from '../hooks/usePayments'
import { EmptyState, toast } from '../../../shared/components/feedback'

export function PaymentsPage() {
  const { user } = useAuthStore()
  const isEmployer = Boolean(user?.is_employer && !user?.is_worker)
  const { transactions, loading, processing, initialized, error, notice, refresh, initiatePayment, refundPayment } = usePayments({ enabled: isEmployer })
  const [refundingId, setRefundingId] = useState<number | null>(null)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 8
  const visibleTransactions = transactions.slice((page - 1) * pageSize, page * pageSize)
  const refund = async (id: number) => { setRefundingId(id); try { await refundPayment(id) } finally { setRefundingId(null) } }
  if (!isEmployer) return <section className="mx-auto max-w-3xl px-4 py-16 text-center"><h1 className="text-2xl font-black text-[#0A2540]">Employer payments only</h1><p className="mt-2 text-sm text-slate-500">Payments are available for employer accounts.</p></section>
  const submitPayment = async (data: Parameters<typeof initiatePayment>[0]) => { try { await initiatePayment(data); setPaymentOpen(false) } catch (submissionError) { toast.error('Payment failed', submissionError instanceof Error ? submissionError.message : 'Unable to complete the payment request.') } }
  return <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"><PageHeader eyebrow="Employer billing" title="Payments" description="Manage M-Pesa payments and review your transaction history." actions={<Button onClick={() => setPaymentOpen(true)} leftIcon={<CreditCard className="h-4 w-4" />}>Make a payment</Button>} />{error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}{notice && <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">{notice}</div>}<section className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-lg font-black text-[#0A2540]">Transaction history</h2><p className="text-sm text-slate-500">Payments initiated from your employer account.</p></div><Button variant="ghost" size="sm" onClick={() => refresh()} disabled={loading} leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button></div>{loading && !initialized ? <div className="space-y-3 py-10" aria-label="Loading transactions" aria-busy="true"><Skeleton className="h-24 w-full rounded-2xl" /><Skeleton className="h-24 w-full rounded-2xl" /><Skeleton className="h-24 w-full rounded-2xl" /></div> : transactions.length ? <><div className="space-y-3">{visibleTransactions.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} onRefund={refund} refunding={refundingId === transaction.id} />)}</div><Pagination page={page} pageSize={pageSize} total={transactions.length} onPageChange={setPage} className="mt-4" /></> : <EmptyState title="No transactions yet" description="Your employer payment history will appear here." icon={<CreditCard className="h-8 w-8" />} size="sm" />}</section><Modal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} title="Make a payment" subtitle="Complete the details to receive an M-Pesa prompt." maxWidth="lg"><PaymentForm onSubmit={submitPayment} submitting={processing} defaultPhone={user?.phone} /></Modal></section>
}