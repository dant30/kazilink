import { CalendarDays, CircleHelp, UserRound } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { Badge } from '../../../shared/components/ui/Badge'
import type { SupportTicket } from '../types'
import { EmptyState } from '../../../shared/components/feedback'

const statusVariant = (status: string): 'success' | 'info' | 'warning' | 'neutral' => status === 'resolved' ? 'success' : status === 'in_progress' ? 'info' : status === 'open' ? 'warning' : 'neutral'

export function SupportTicketList({ tickets, onClose, closingId }: { tickets: SupportTicket[]; onClose: (id: number) => Promise<unknown>; closingId?: number | null }) {
  if (!tickets.length) return <EmptyState title="No support tickets yet" description="Support requests will appear here." icon={<CircleHelp className="h-8 w-8" />} size="md" />
  return <div className="space-y-3">{tickets.map((ticket) => <article key={ticket.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Ticket #{ticket.id}</p><h3 className="mt-1 text-base font-black text-slate-900">{ticket.subject}</h3></div><Badge variant={statusVariant(ticket.status)}>{ticket.status.replace('_', ' ')}</Badge></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{ticket.description}</p><div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500"><span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Updated {new Date(ticket.updated_at).toLocaleDateString()}</span>{ticket.assigned_to_name && <span className="flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" />{ticket.assigned_to_name}</span>}{ticket.status !== 'closed' && <Button variant="ghost" size="sm" onClick={() => onClose(ticket.id)} disabled={closingId === ticket.id}>{closingId === ticket.id ? 'Closing...' : 'Close ticket'}</Button>}</div></article>)}</div>
}
