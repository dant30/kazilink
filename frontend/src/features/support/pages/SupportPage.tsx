import { useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  PlusCircle,
  RefreshCw,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { Modal } from '../../../shared/components/ui/Modal'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { SupportTicketForm, SupportTicketList } from '../components'
import { useSupport } from '../hooks/useSupport'

const hospitalityFaqs = [
  {
    q: 'How does M-Pesa Escrow protect casual shift wages?',
    a: 'When an employer books a worker for a shift, the agreed wage is locked in verified escrow. Once the worker checks in and concludes the shift satisfactorily, funds are instantly released directly to the worker’s M-Pesa phone number.',
  },
  {
    q: 'How are worker employment histories and references verified?',
    a: 'Every worker employment passport entry is cross-referenced with past managers, operations heads, or establishment owners. Only verified positions receive the official KaziLink Green Shield badge.',
  },
  {
    q: 'What should an establishment do if a booked casual worker cancels?',
    a: 'If a casual worker cancels within 4 hours of the shift, KaziLink immediately triggers our Priority On-Call Pool and alerts qualified nearby workers. The employer also receives immediate credit reimbursement.',
  },
  {
    q: 'How do Kazi Credits work for workers and employers?',
    a: 'Kazi Credits allow workers to apply for premium high-rate shifts and boost profile visibility. For employers, credits unlock instant job highlights, featured placements, and urgent shift broadcasts across Nairobi and major cities.',
  },
]

export function SupportPage() {
  const { tickets, loading, submitting, error, refresh, createTicket, closeTicket } = useSupport()
  const [closingId, setClosingId] = useState<number | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const pageSize = 6

  const filteredTickets = useMemo(() => {
    if (statusFilter === 'all') return tickets
    if (statusFilter === 'resolved') {
      return tickets.filter((t) => t.status === 'resolved' || t.status === 'closed')
    }
    return tickets.filter((t) => t.status === statusFilter)
  }, [tickets, statusFilter])

  const visibleTickets = filteredTickets.slice((page - 1) * pageSize, page * pageSize)

  const submit = async (data: { subject: string; description: string }) => {
    await createTicket(data)
    setFormOpen(false)
  }

  const close = async (id: number) => {
    setClosingId(id)
    try {
      await closeTicket(id)
    } finally {
      setClosingId(null)
    }
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6 sm:space-y-8 px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8">
      <PageHeader
        eyebrow="Help & Resolutions"
        title="Support Desk"
        description="Get rapid help with shift disputes, M-Pesa escrow releases, account verifications, or casual worker attendance."
        icon={<HelpCircle className="h-4 w-4" />}
        actions={
          <Button
            onClick={() => setFormOpen(true)}
            leftIcon={<PlusCircle className="h-4 w-4" />}
            className="rounded-xl text-xs font-bold min-h-[40px]"
          >
            Create support ticket
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#FF6B00]">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Helpline</p>
              <a
                href="tel:+254728102107"
                className="text-sm sm:text-base font-black text-slate-900 hover:text-[#FF6B00] transition font-mono"
              >
                +254 728 102 107
              </a>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Live phone support available Mon-Sat, 7:00 AM – 10:00 PM EAT.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">WhatsApp Dispatch</p>
              <a
                href="https://wa.me/254728102107"
                target="_blank"
                rel="noreferrer"
                className="text-sm sm:text-base font-black text-slate-900 hover:text-emerald-600 transition font-mono"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Fast escalation for shift no-shows and urgent replacements.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Inquiries</p>
              <a
                href="mailto:support@kazilink.co.ke"
                className="text-sm sm:text-base font-black text-slate-900 hover:text-blue-600 transition font-mono"
              >
                support@kazilink.co.ke
              </a>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">For billing queries, compliance audits, and partnerships.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-7 shadow-xs">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0A2540]">Your support tickets</h2>
            <p className="text-xs text-slate-500">Track and respond to tickets submitted from your account.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1">
              {(['all', 'open', 'in_progress', 'resolved'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setStatusFilter(filter)
                    setPage(1)
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition ${
                    statusFilter === filter
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => refresh()}
              disabled={loading}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              className="rounded-xl text-xs"
            >
              Refresh
            </Button>
          </div>
        </div>

        {loading && !tickets.length ? (
          <div className="space-y-3 py-6" aria-label="Loading tickets" aria-busy="true">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : (
          <>
            <SupportTicketList tickets={visibleTickets} onClose={close} closingId={closingId} />
            {filteredTickets.length > pageSize && (
              <Pagination
                page={page}
                pageSize={pageSize}
                total={filteredTickets.length}
                onPageChange={setPage}
                className="mt-4"
              />
            )}
          </>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-7 shadow-xs">
        <div className="mb-4">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00]">Instant answers</span>
          <h2 className="text-base sm:text-lg font-black text-[#0A2540]">Frequently asked hospitality questions</h2>
        </div>

        <div className="space-y-2.5">
          {hospitalityFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 transition hover:border-slate-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-800 min-h-[48px]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-[#FF6B00] shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs leading-relaxed text-slate-600 border-t border-slate-100/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title="Contact support desk"
        subtitle="Our Nairobi operations desk will review and reply directly."
        maxWidth="lg"
      >
        <SupportTicketForm onSubmit={submit} submitting={submitting} />
      </Modal>
    </section>
  )
}
