import { useMemo, useState } from 'react'
import { CheckCircle2, CircleHelp, Clock3, Filter, Search, Ticket } from 'lucide-react'
import { DataTable } from '../../../../shared/components/tables'
import { StatCard } from '../../../../shared/components/cards/StatCard'
import { Badge } from '../../../../shared/components/ui/Badge'
import { PageHeader } from '../../../../shared/components/ui/PageHeader'
import { Select } from '../../../../shared/components/ui/Select'
import { Skeleton } from '../../../../shared/components/ui/Skeleton'
import { ErrorBoundary } from '../../../../shared/components/ui/ErrorBoundary'
import { useAdminSupport } from '../../hooks/useAdminSupport'

const variant = (status: string): 'warning' | 'info' | 'success' | 'neutral' => status === 'open' ? 'warning' : status === 'in_progress' ? 'info' : status === 'resolved' ? 'success' : 'neutral'

export function AdminSupportPage() {
  const { tickets, loading, error, actionId, updateStatus } = useAdminSupport()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const filtered = useMemo(() => tickets.filter((ticket) => (!status || ticket.status === status) && `${ticket.subject} ${ticket.description} ${ticket.user_name} ${ticket.assigned_to_name || ''}`.toLowerCase().includes(query.toLowerCase())), [query, status, tickets])
  const statusOptions = [{ value: '', label: 'All statuses' }, { value: 'open', label: 'Open' }, { value: 'in_progress', label: 'In progress' }, { value: 'resolved', label: 'Resolved' }, { value: 'closed', label: 'Closed' }]
  return (
    <ErrorBoundary>
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Customer operations"
        title="Support queue"
        description="Triage customer requests, track ownership, and close resolved issues."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total tickets" value={tickets.length} subtitle="Requests received" icon={<Ticket className="h-5 w-5" />} />
        <StatCard title="Open" value={tickets.filter((ticket) => ticket.status === 'open').length} subtitle="Awaiting first response" icon={<Clock3 className="h-5 w-5" />} iconBg="bg-amber-50 text-amber-600" />
        <StatCard title="In progress" value={tickets.filter((ticket) => ticket.status === 'in_progress').length} subtitle="Being handled" icon={<CircleHelp className="h-5 w-5" />} iconBg="bg-sky-50 text-sky-600" />
        <StatCard title="Resolved" value={tickets.filter((ticket) => ticket.status === 'resolved').length} subtitle="Ready to close" icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" />
      </div><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-lg font-black text-slate-900">Ticket queue</h2><p className="text-sm text-slate-500">Search requests and update their operational status.</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tickets" className="w-full bg-transparent outline-none sm:w-52" /></label><div className="flex items-center gap-2"><Filter className="h-4 w-4 text-slate-400" /><Select value={status} onChange={setStatus} options={statusOptions} className="flex-1" /></div></div></div>{error && <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}{loading ? <p className="p-8 text-center text-sm text-slate-500">Loading support tickets...</p> : <DataTable data={filtered} keyExtractor={(ticket) => String(ticket.id)} emptyMessage="No tickets match the current filters." columns={[{ header: 'Ticket', render: (ticket) => <div><p className="font-bold text-slate-900">#{ticket.id} {ticket.subject}</p><p className="max-w-xs truncate text-xs text-slate-500">{ticket.description}</p></div> }, { header: 'Requester', render: (ticket) => <div><p className="font-semibold text-slate-800">{ticket.user_name}</p><p className="text-xs text-slate-500">User #{ticket.user}</p></div> }, { header: 'Updated', render: (ticket) => new Date(ticket.updated_at).toLocaleString() }, { header: 'Assignee', render: (ticket) => ticket.assigned_to_name || 'Unassigned' }, { header: 'Status', render: (ticket) => <Badge variant={variant(ticket.status)}>{ticket.status.replace('_', ' ')}</Badge> }, { header: 'Update', render: (ticket) => ticket.status === 'closed' ? <span className="text-xs text-slate-400">Closed</span> : <select aria-label={`Update ticket ${ticket.id} status`} value={ticket.status} disabled={actionId === ticket.id} onChange={(event) => updateStatus(ticket.id, event.target.value).catch(() => undefined)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"><option value="open">Open</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select> }]} />}</section></section>
  </ErrorBoundary>
  )
}