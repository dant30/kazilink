import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { Modal } from '../../../shared/components/ui/Modal'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { SupportTicketForm, SupportTicketList } from '../components'
import { useSupport } from '../hooks/useSupport'

export function SupportPage() {
  const { tickets, loading, submitting, error, refresh, createTicket, closeTicket } = useSupport()
  const [closingId, setClosingId] = useState<number | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 6
  const visibleTickets = tickets.slice((page - 1) * pageSize, page * pageSize)
  const submit = async (data: { subject: string; description: string }) => { await createTicket(data); setFormOpen(false) }
  const close = async (id: number) => { setClosingId(id); try { await closeTicket(id) } finally { setClosingId(null) } }
  return (
    <section className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Help desk"
        title="Support"
        description="Get help with your account, jobs, payments, or verification."
        actions={
          <Button onClick={() => setFormOpen(true)} className="sm:w-auto">
            Contact support
          </Button>
        }
      />

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-[#0A2540]">Your tickets</h2>
            <p className="text-sm text-slate-500">Track requests submitted from your account.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => refresh()} disabled={loading} aria-label="Refresh support tickets" leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
        </div>
        {loading && !tickets.length ? <div className="space-y-3 py-8" aria-label="Loading tickets" aria-busy="true"><Skeleton className="h-16 w-full rounded-2xl" /><Skeleton className="h-16 w-full rounded-2xl" /><Skeleton className="h-16 w-full rounded-2xl" /></div> : <><SupportTicketList tickets={visibleTickets} onClose={close} closingId={closingId} /><Pagination page={page} pageSize={pageSize} total={tickets.length} onPageChange={setPage} className="mt-4" /></>}
      </section>

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title="Contact support" subtitle="Your request will be sent to the KaziLink support team." maxWidth="lg">
        <SupportTicketForm onSubmit={submit} submitting={submitting} />
      </Modal>
    </section>
  )
}