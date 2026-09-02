import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, RefreshCw, ShieldAlert } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Select } from '../../../shared/components/ui/Select'
import { ErrorBoundary } from '../../../shared/components/ui/ErrorBoundary'
import { StatCard } from '../../../shared/components/cards/StatCard'
import { EmptyState } from '../../../shared/components/feedback'
import { FraudAlertCard } from '../components'
import { useFraudAlerts } from '../hooks/useFraudAlerts'
export function FraudAlertsPage() {
  const { alerts, loading, error, initialized, actionId, refresh, updateStatus } = useFraudAlerts()
  const [statusFilter, setStatusFilter] = useState('pending')
  const [severityFilter, setSeverityFilter] = useState('')
  const filtered = useMemo(() => alerts.filter((alert) => (!statusFilter || alert.status === statusFilter) && (!severityFilter || alert.severity === severityFilter)), [alerts, severityFilter, statusFilter])
  const pending = alerts.filter((alert) => alert.status === 'pending')
  const resolve = (id: number, status: 'resolved' | 'dismissed') => updateStatus(id, status)
  const statusOptions = [{ value: '', label: 'All statuses' }, { value: 'pending', label: 'Pending' }, { value: 'resolved', label: 'Resolved' }, { value: 'dismissed', label: 'Dismissed' }]
  const severityOptions = [{ value: '', label: 'All severities' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]
  return (
    <ErrorBoundary>
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"><PageHeader eyebrow="Risk operations" title="Fraud alerts" description="Review automated risk signals and record the outcome of each investigation." actions={<Button variant="outline" onClick={() => refresh()} disabled={loading} leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button>} />{error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}<div className="grid gap-4 md:grid-cols-3"><StatCard title="Total alerts" value={alerts.length} subtitle="Signals recorded" icon={<ShieldAlert className="h-5 w-5" />} /><StatCard title="Pending review" value={pending.length} subtitle="Require an admin decision" icon={<AlertTriangle className="h-5 w-5" />} iconBg="bg-amber-50 text-amber-600" /><StatCard title="Resolved" value={alerts.filter((alert) => alert.status === 'resolved').length} subtitle="Confirmed outcomes" icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" /></div><section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-lg font-black text-[#0A2540]">Alert queue</h2><p className="text-sm text-slate-500">Filter by investigation status and severity.</p></div><div className="flex flex-wrap gap-2"><Select value={statusFilter} onChange={setStatusFilter} options={statusOptions} /><Select value={severityFilter} onChange={setSeverityFilter} options={severityOptions} /></div></div>{loading && !initialized ? <p className="py-10 text-center text-sm text-slate-500">Loading fraud alerts...</p> : filtered.length ? <div className="space-y-4">{filtered.map((alert) => <FraudAlertCard key={alert.id} alert={alert} onResolve={resolve} actionId={actionId} />)}</div> : <EmptyState title="No matching alerts" description="No fraud alerts match the selected filters." icon={<ShieldAlert className="h-5 w-5" />} size="sm" />}</section>
      </section>
    </ErrorBoundary>
  )
}
