import { useState, type FormEvent } from 'react'
import { BarChart3, CalendarPlus, Download, LineChart as LineIcon, RefreshCw, TrendingUp } from 'lucide-react'
import { BarChart } from '../../../../shared/components/charts/BarChart'
import { LineChart } from '../../../../shared/components/charts/LineChart'
import { EmptyState } from '../../../../shared/components/feedback'
import { StatCard } from '../../../../shared/components/cards/StatCard'
import { FormActions, FormField, FormSection } from '../../../../shared/components/forms'
import { Button } from '../../../../shared/components/ui/Button'
import { DatePicker } from '../../../../shared/components/ui/DatePicker'
import { Modal } from '../../../../shared/components/ui/Modal'
import { Skeleton } from '../../../../shared/components/ui/Skeleton'
import { PageHeader } from '../../../../shared/components/ui/PageHeader'
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics'

export function AdminAnalyticsPage() {
  const { snapshots, latest, loading, processing, error, refresh, generate, download } = useAdminAnalytics()
  const [generateOpen, setGenerateOpen] = useState(false)
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [exportingId, setExportingId] = useState<number | null>(null)

  const submitGeneration = async (event: FormEvent) => {
    event.preventDefault()
    await generate(periodStart, periodEnd)
    setGenerateOpen(false)
    setPeriodStart('')
    setPeriodEnd('')
  }

  const exportSnapshot = async (id: number, start: string, end: string) => {
    setExportingId(id)
    try { await download(id, start, end) } finally { setExportingId(null) }
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Business intelligence" title="Reports & KPIs" description="Track marketplace health using generated, period-based performance snapshots." actions={<div className="flex gap-2"><Button variant="outline" onClick={() => refresh()} disabled={loading} aria-label="Refresh analytics" leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button><Button onClick={() => setGenerateOpen(true)} leftIcon={<CalendarPlus className="h-4 w-4" />}>Generate snapshot</Button></div>} />

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
      {loading && !latest ? <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-32 rounded-2xl" />)}</div> : latest ? <>
        <div className="grid gap-4 md:grid-cols-4"><StatCard title="New workers" value={latest.registered_workers} subtitle="Joined during period" icon={<TrendingUp className="h-5 w-5" />} /><StatCard title="Active employers" value={latest.active_employers} subtitle="Active employer accounts" icon={<BarChart3 className="h-5 w-5" />} iconBg="bg-orange-50 text-[#FF6B00]" /><StatCard title="Applications" value={latest.applications} subtitle={`${latest.successful_hires} successful hires`} icon={<LineIcon className="h-5 w-5" />} iconBg="bg-sky-50 text-sky-600" /><StatCard title="Revenue per payer" value={`KSh ${Number(latest.average_revenue_per_paying_employer_ksh).toLocaleString()}`} subtitle={`${latest.premium_purchase_rate}% premium purchase rate`} icon={<TrendingUp className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" /></div>
        <div className="grid gap-6 lg:grid-cols-2"><LineChart title="Marketplace activity" subtitle="Applications and successful hires by snapshot period" data={snapshots.slice().reverse().map((snapshot) => ({ label: snapshot.period_end, value: snapshot.applications, secondaryValue: snapshot.successful_hires }))} /><BarChart title="Growth indicators" subtitle="Latest snapshot volume" data={[{ label: 'Workers', value: latest.registered_workers, color: '#0A2540' }, { label: 'Employers', value: latest.active_employers, color: '#FF6B00' }, { label: 'Jobs', value: latest.jobs_posted, color: '#0EA5E9' }, { label: 'Hires', value: latest.successful_hires, color: '#059669' }]} /></div>
      </> : <EmptyState title="No analytics snapshots" description="Generate a period snapshot to start tracking marketplace performance." action={<Button onClick={() => setGenerateOpen(true)} leftIcon={<CalendarPlus className="h-4 w-4" />}>Generate snapshot</Button>} />}

      {snapshots.length > 0 && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black text-[#0A2540]">Snapshot history</h2><div className="mt-4 space-y-3">{snapshots.map((snapshot) => <div key={snapshot.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-slate-900">{snapshot.period_start} to {snapshot.period_end}</p><p className="mt-1 text-xs text-slate-500">{snapshot.applications} applications · {snapshot.successful_hires} hires · created {new Date(snapshot.created_at).toLocaleDateString()}</p></div><Button variant="outline" size="sm" disabled={exportingId === snapshot.id} onClick={() => exportSnapshot(snapshot.id, snapshot.period_start, snapshot.period_end)} leftIcon={<Download className="h-4 w-4" />}>{exportingId === snapshot.id ? 'Exporting...' : 'Export CSV'}</Button></div>)}</div></section>}

      <Modal isOpen={generateOpen} onClose={() => setGenerateOpen(false)} title="Generate analytics snapshot" subtitle="Choose the reporting period to calculate." maxWidth="md"><form id="analytics-generation" onSubmit={submitGeneration}><FormSection title="Reporting period" description="The backend will calculate metrics for these dates." icon={<CalendarPlus className="h-4 w-4" />} divider={false}><FormField label="Period start" required><DatePicker value={periodStart} onChange={setPeriodStart} maxDate={periodEnd || undefined} /></FormField><FormField label="Period end" required><DatePicker value={periodEnd} onChange={setPeriodEnd} minDate={periodStart || undefined} /></FormField></FormSection><FormActions formId="analytics-generation" submitLabel="Generate snapshot" loading={processing} disabled={!periodStart || !periodEnd} /></form></Modal>
    </section>
  )
}
