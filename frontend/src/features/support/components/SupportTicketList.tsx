import { CalendarDays, CircleHelp, UserRound, CheckCircle2, Clock3, AlertCircle } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { Badge } from '../../../shared/components/ui/Badge'
import type { SupportTicket } from '../types'
import { EmptyState } from '../../../shared/components/feedback'
import { formatRelativeTime } from '../../../core/utils'

const statusVariant = (status: string): 'success' | 'info' | 'warning' | 'neutral' =>
  status === 'resolved' || status === 'closed'
    ? 'success'
    : status === 'in_progress'
    ? 'info'
    : status === 'open'
    ? 'warning'
    : 'neutral'

export function SupportTicketList({
  tickets,
  onClose,
  closingId,
}: {
  tickets: SupportTicket[]
  onClose: (id: number) => Promise<unknown>
  closingId?: number | null
}) {
  if (!tickets.length) {
    return (
      <EmptyState
        title="No support tickets found"
        description="Submit a ticket above if you need assistance with an application, payment, or shift verification."
        icon={<CircleHelp className="h-8 w-8 text-slate-400" />}
        size="md"
      />
    )
  }

  return (
    <div className="space-y-3.5">
      {tickets.map((ticket) => (
        <article
          key={ticket.id}
          className="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Ticket #{ticket.id}
              </span>
              <h3 className="mt-0.5 text-sm sm:text-base font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors">
                {ticket.subject}
              </h3>
            </div>
            <div className="w-fit">
              <Badge variant={statusVariant(ticket.status)} size="sm">
                {ticket.status.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
            {ticket.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px]">
              <span className="flex items-center gap-1 text-slate-400">
                <CalendarDays className="h-3 w-3 text-[#FF6B00]" />
                Updated {formatRelativeTime(ticket.updated_at)}
              </span>
              {ticket.assigned_to_name && (
                <span className="flex items-center gap-1 text-slate-600 font-semibold">
                  <UserRound className="h-3 w-3 text-slate-400" />
                  Assigned to: {ticket.assigned_to_name}
                </span>
              )}
            </div>

            {ticket.status !== 'closed' && ticket.status !== 'resolved' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onClose(ticket.id)}
                disabled={closingId === ticket.id}
                className="rounded-xl text-xs text-slate-600 hover:text-rose-600"
              >
                {closingId === ticket.id ? 'Closing...' : 'Mark resolved'}
              </Button>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

