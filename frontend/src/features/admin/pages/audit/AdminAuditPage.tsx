import { useMemo, useState } from 'react'
import { Activity, CalendarClock, FileText, Filter, Search, ShieldCheck } from 'lucide-react'
import { DataTable } from '../../../../shared/components/tables'
import { StatCard } from '../../../../shared/components/cards/StatCard'
import { Badge } from '../../../../shared/components/ui/Badge'
import { PageHeader } from '../../../../shared/components/ui/PageHeader'
import { Skeleton } from '../../../../shared/components/ui/Skeleton'
import { useAdminAudit } from '../../hooks/useAdminAudit'
import type { AuditLog } from '../../../audit/types'

export function AdminAuditPage() {
  const { logs, loading, initialized, error, refresh } = useAdminAudit()
  const [query, setQuery] = useState('')
  const [targetType, setTargetType] = useState('')
  const [action, setAction] = useState('')
  const targetTypes = useMemo(() => [...new Set(logs.map((log) => log.target_type).filter(Boolean))].sort(), [logs])
  const actions = useMemo(() => [...new Set(logs.map((log) => log.action).filter(Boolean))].sort(), [logs])
  const filtered = useMemo(() => logs.filter((log) => (!targetType || log.target_type === targetType) && (!action || log.action === action) && `${log.actor_name || ''} ${log.action} ${log.target_type} ${log.target_id}`.toLowerCase().includes(query.toLowerCase())), [action, logs, query, targetType])
  const today = new Date().toDateString()
    return (
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader eyebrow="Security traceability" title="Audit log" description="Review recorded platform actions and investigate operational history." actions={<button type="button" onClick={() => refresh()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 disabled:opacity-50"><Activity className="h-4 w-4" />Refresh log</button>} />
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Events" value={logs.length} subtitle="Recorded audit entries" icon={<FileText className="h-5 w-5" />} />
          <StatCard title="Today" value={logs.filter((log) => new Date(log.created_at).toDateString() === today).length} subtitle="Events since midnight" icon={<CalendarClock className="h-5 w-5" />} iconBg="bg-orange-50 text-[#FF6B00]" />
          <StatCard title="Actions" value={new Set(logs.map((log) => log.action)).size} subtitle="Distinct operation types" icon={<ShieldCheck className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" />
        </div>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div><h2 className="text-lg font-black text-slate-900">Event history</h2><p className="text-sm text-slate-500">Search actors and targets, then narrow by operation type.</p></div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search audit events" className="w-full bg-transparent outline-none sm:w-52" /></label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"><Filter className="h-4 w-4 text-slate-400" /><select value={targetType} onChange={(event) => setTargetType(event.target.value)} className="bg-transparent outline-none"><option value="">All targets</option>{targetTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
              <select value={action} onChange={(event) => setAction(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="">All actions</option>{actions.map((item) => <option key={item} value={item}>{item}</option>)}</select>
            </div>
          </div>
          {error && <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
          {loading && !initialized ? <div className="space-y-3 p-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div> : <DataTable data={filtered} keyExtractor={(log) => String(log.id)} emptyMessage="No audit events match the current filters." columns={[{ header: 'Timestamp', render: (log) => <span className="whitespace-nowrap text-xs text-slate-600">{new Date(log.created_at).toLocaleString()}</span> }, { header: 'Actor', render: (log) => <span className="font-semibold text-slate-800">{log.actor_name || 'System'}</span> }, { header: 'Action', render: (log) => <Badge variant="neutral">{log.action}</Badge> }, { header: 'Target', render: (log) => <span>{log.target_type}:{log.target_id}</span> }, { header: 'Metadata', render: (log) => <span className="block max-w-xs truncate font-mono text-xs text-slate-500">{Object.keys(log.metadata).length ? JSON.stringify(log.metadata) : 'No metadata'}</span> }]} />}
        </section>
      </section>
    )
}
