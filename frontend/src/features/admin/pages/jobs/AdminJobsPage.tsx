import { useMemo, useState } from 'react'
import { Briefcase, CheckCircle2, Clock3, Filter, Search, Users, XCircle } from 'lucide-react'
import { DataTable } from '../../../../shared/components/tables'
import { StatCard } from '../../../../shared/components/cards/StatCard'
import { Badge } from '../../../../shared/components/ui/Badge'
import { PageHeader } from '../../../../shared/components/ui/PageHeader'
import { Select } from '../../../../shared/components/ui/Select'
import { ErrorBoundary } from '../../../../shared/components/ui/ErrorBoundary'
import { useAdminJobs } from '../../hooks/useAdminJobs'

const statusVariant = (value: string): 'success' | 'warning' | 'info' | 'neutral' => value === 'open' ? 'success' : value === 'draft' ? 'warning' : value === 'filled' ? 'info' : 'neutral'
const statusLabel = (value: string) => value.replace(/_/g, ' ')

export function AdminJobsPage() {
  const { jobs, loading, error } = useAdminJobs()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const categories = useMemo(() => [...new Set(jobs.map((job) => job.category).filter(Boolean))].sort(), [jobs])
  const filtered = useMemo(() => jobs.filter((job) => (!status || job.status === status) && (!category || job.category === category) && `${job.title} ${job.category} ${job.location} ${job.employer_name || ''}`.toLowerCase().includes(query.toLowerCase())), [category, jobs, query, status])
  const statusOptions = [{ value: '', label: 'All statuses' }, { value: 'open', label: 'Open' }, { value: 'draft', label: 'Draft' }, { value: 'filled', label: 'Filled' }, { value: 'closed', label: 'Closed' }]
  const categoryOptions = [{ value: '', label: 'All categories' }, ...categories.map((item) => ({ value: item, label: item }))]
  return (
    <ErrorBoundary>
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Admin oversight"
        title="Job postings"
        description="Monitor marketplace listings, applicant activity, and posting status."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total jobs" value={jobs.length} subtitle="Marketplace listings" icon={<Briefcase className="h-5 w-5" />} />
        <StatCard title="Open" value={jobs.filter((job) => job.status === 'open').length} subtitle="Accepting applications" icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" />
        <StatCard title="Filled" value={jobs.filter((job) => job.status === 'filled').length} subtitle="Successful placements" icon={<Users className="h-5 w-5" />} iconBg="bg-sky-50 text-sky-600" />
        <StatCard title="Drafts" value={jobs.filter((job) => job.status === 'draft').length} subtitle="Not yet published" icon={<Clock3 className="h-5 w-5" />} iconBg="bg-amber-50 text-amber-600" />
      </div><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-lg font-black text-slate-900">Listing ledger</h2><p className="text-sm text-slate-500">Search by role, category, location, or employer.</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search jobs" className="w-full bg-transparent outline-none sm:w-48" /></label><div className="flex items-center gap-2"><Filter className="h-4 w-4 text-slate-400" /><Select value={status} onChange={setStatus} options={statusOptions} className="flex-1" /></div><Select value={category} onChange={setCategory} options={categoryOptions} className="flex-1" /></div></div>{error && <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}{loading ? <p className="p-8 text-center text-sm text-slate-500">Loading job postings...</p> : <DataTable data={filtered} keyExtractor={(job) => String(job.id)} emptyMessage="No job postings match the current filters." columns={[{ header: 'Role', render: (job) => <div><p className="font-bold text-slate-900">{job.title}</p><p className="text-xs text-slate-500">{job.category}</p></div> }, { header: 'Employer', render: (job) => job.employer_name || `Employer #${job.employer}` }, { header: 'Location', accessor: 'location' }, { header: 'Pay', render: (job) => `KSh ${job.pay_amount_ksh.toLocaleString()} / ${job.pay_period}` }, { header: 'Applicants', accessor: 'applicant_count', className: 'text-right font-bold' }, { header: 'Status', render: (job) => <Badge variant={statusVariant(job.status)}>{statusLabel(job.status)}</Badge> }, { header: 'Posted', render: (job) => job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'Not posted' }]} />}</section></section>
      </ErrorBoundary>
  )
}
