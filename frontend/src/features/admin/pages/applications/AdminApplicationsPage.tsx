import { useMemo, useState } from 'react'
import { Briefcase, CheckCircle2, Filter, Search } from 'lucide-react'
import { DataTable } from '../../../../shared/components/tables'
import { StatCard } from '../../../../shared/components/cards/StatCard'
import { PageHeader } from '../../../../shared/components/ui/PageHeader'
import { Select } from '../../../../shared/components/ui/Select'
import { Skeleton } from '../../../../shared/components/ui/Skeleton'
import { ErrorBoundary } from '../../../../shared/components/ui/ErrorBoundary'
import { ApplicationStatusBadge } from '../../../job_applications/components/ApplicationStatusBadge'
import { useAdminApplications } from '../../hooks/useAdminApplications'
import type { JobApplicationStatus } from '../../../job_applications/types'

const statuses: Array<{ value: JobApplicationStatus | ''; label: string }> = [
  { value: '', label: 'All statuses' },
  { value: 'applied', label: 'Applied' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview_scheduled', label: 'Interview scheduled' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
]

export function AdminApplicationsPage() {
  const { applications, loading, error, updateStatus } = useAdminApplications()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<JobApplicationStatus | ''>('')
  const filtered = useMemo(
    () => applications.filter((application) => (!status || application.status === status) && `${application.worker_name || ''} ${application.job_title || ''} ${application.employer_name || ''}`.toLowerCase().includes(query.toLowerCase())),
    [applications, query, status],
  )
  const update = async (id: number, nextStatus: JobApplicationStatus) => { await updateStatus(id, { status: nextStatus }) }

  return (
    <ErrorBoundary>
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Admin oversight" title="Application queue" description="Review marketplace applications and keep hiring decisions moving." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Applications" value={applications.length} subtitle="Across the marketplace" icon={<Briefcase className="h-5 w-5" />} />
        <StatCard title="Awaiting review" value={applications.filter((application) => ['applied', 'shortlisted'].includes(application.status)).length} subtitle="Active hiring decisions" icon={<Filter className="h-5 w-5" />} iconBg="bg-amber-50 text-amber-600" />
        <StatCard title="Hired" value={applications.filter((application) => application.status === 'hired').length} subtitle="Successful placements" icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" />
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div><h2 className="text-lg font-black text-slate-900">Marketplace applications</h2><p className="text-sm text-slate-500">Search candidates, roles, and employers.</p></div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search applications" className="w-full bg-transparent outline-none sm:w-52" /></label>
            <Select value={status} onChange={(value) => setStatus(value as JobApplicationStatus | '')} options={statuses} />
          </div>
        </div>
        {error && <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading ? <div className="space-y-3 p-8" aria-label="Loading applications" aria-busy="true"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div> : <DataTable data={filtered} keyExtractor={(application) => String(application.id)} emptyMessage="No applications match the current filters." columns={[
          { header: 'Candidate', render: (application) => <div><p className="font-bold text-slate-900">{application.worker_name || `Worker #${application.worker}`}</p><p className="text-xs text-slate-500">{application.worker_phone || 'No phone provided'}</p></div> },
          { header: 'Role', render: (application) => <div><p className="font-semibold text-slate-800">{application.job_title || `Job #${application.job}`}</p><p className="text-xs text-slate-500">{application.employer_name || 'Employer'}</p></div> },
          { header: 'Applied', render: (application) => new Date(application.applied_date).toLocaleDateString() },
          { header: 'Status', render: (application) => <ApplicationStatusBadge status={application.status} /> },
          { header: 'Decision', render: (application) => application.status === 'hired' || application.status === 'rejected' ? <span className="text-xs text-slate-400">Final</span> : <Select aria-label={`Update application ${application.id} status`} value={application.status} onChange={(value) => void update(application.id, value as JobApplicationStatus)} options={statuses.filter((option) => option.value)} className="min-w-36" /> },
        ]} />}
      </section>
    </section>
    </ErrorBoundary>
  )
}
