import { ArrowRight, Briefcase, FileText, Filter, ListFilter } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useAuthStore } from '../../auth/store/authStore'
import { ApplicationCard, ApplicationStatusBadge } from '../components'
import { useApplications } from '../hooks'
import type { ApplicationFilters, JobApplicationStatus } from '../types'
import { StatCard } from '../../../shared/components/cards/StatCard'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { Select } from '../../../shared/components/ui/Select'
import { ErrorBoundary } from '../../../shared/components/ui/ErrorBoundary'
import { EmptyState } from '../../../shared/components/feedback'
import { Skeleton } from '../../../shared/components/ui/Skeleton'

const statusOptions: Array<{ value: JobApplicationStatus | ''; label: string }> = [
  { value: '', label: 'All statuses' },
  { value: 'applied', label: 'Applied' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview_scheduled', label: 'Interview scheduled' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
]

export function ApplicationsPage() {
  const { user } = useAuthStore()
  const [statusFilter, setStatusFilter] = useState<JobApplicationStatus | ''>('')
  const [page, setPage] = useState(1)
  const isEmployer = Boolean(user?.is_employer && !user?.is_worker)
  const isWorker = Boolean(user?.is_worker)
  const isAdmin = Boolean(user?.is_staff || user?.is_superuser)

  const scope = isAdmin ? 'admin' : isEmployer ? 'employer' : isWorker ? 'mine' : 'mine'
  const filters: ApplicationFilters = statusFilter ? { status: statusFilter } : {}
  const { applications, loading, error } = useApplications(scope, filters)
  const pageSize = 8
  const visibleApplications = applications.slice((page - 1) * pageSize, page * pageSize)

  const counts = useMemo(() => ({
    total: applications.length,
    shortlisted: applications.filter((application) => application.status === 'shortlisted').length,
    interview: applications.filter((application) => application.status === 'interview_scheduled').length,
    hired: applications.filter((application) => application.status === 'hired').length,
  }), [applications])

  return (
    <ErrorBoundary>
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Applications"
        title={isEmployer ? 'Applicant pipeline' : isAdmin ? 'Marketplace applications' : 'My applications'}
        actions={
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200">
            <Briefcase className="h-4 w-4 text-[#FF6B00]" />
            {counts.total} total records
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard title="Total" value={counts.total} subtitle="Applications received" sparkline={[3, 5, 4, 8, 7, 10, Math.max(counts.total, 8)]} metadata={[{ label: 'Conversion', value: `${counts.total > 0 ? Math.round((counts.hired / counts.total) * 100) : 0}%` }]} icon={<FileText className="h-5 w-5" />} />
          <StatCard title="Shortlisted" value={counts.shortlisted} subtitle="Candidates to review" badge={{ text: 'Priority', variant: 'orange' }} sparkline={{ data: [1, 2, 1, 3, 4, 5, Math.max(counts.shortlisted, 2)], type: 'bar', color: '#FF6B00' }} icon={<ApplicationStatusBadge status="shortlisted" />} iconBg="bg-orange-50 text-[#FF6B00]" />
          <StatCard title="Interviews" value={counts.interview} subtitle="Scheduled conversations" badge={{ text: 'Calendar', variant: 'blue' }} sparkline={{ data: [0, 1, 1, 2, 2, 3, Math.max(counts.interview, 1)], type: 'line', color: '#0284C7' }} icon={<ApplicationStatusBadge status="interview_scheduled" />} iconBg="bg-sky-50 text-sky-600" />
          <StatCard title="Hired" value={counts.hired} subtitle="Successful placements" progress={{ value: counts.total > 0 ? Math.round((counts.hired / counts.total) * 100) : 0, max: 100, label: 'Placement rate', color: '#059669' }} metadata={[{ label: 'Payment status', value: 'Ready' }]} icon={<ApplicationStatusBadge status="hired" />} iconBg="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="card-kazilink p-4 sm:p-6">
        <div className="flex flex-col gap-3.5 border-b border-slate-200 pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div>
            <h2 className="text-lg font-black text-slate-900">Review applications</h2>
            <p className="text-xs text-slate-500">Track outstanding candidate activity and next steps.</p>
          </div>{statusFilter && <button type="button" onClick={() => { setStatusFilter(''); setPage(1) }} className="self-start text-xs font-bold text-[#FF6B00] hover:underline sm:self-auto">Reset filter</button>}</div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"><span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status:</span>{statusOptions.map((option) => <button key={option.value || 'all'} type="button" onClick={() => { setStatusFilter(option.value); setPage(1) }} className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${statusFilter === option.value ? 'bg-[#0A2540] text-white' : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'}`}>{option.label}</button>)}</div>
        </div>

        {loading && <div className="mt-6 grid gap-4 lg:grid-cols-2" aria-label="Loading applications" aria-busy="true">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-48 rounded-2xl" />)}</div>}
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {!loading && !error && applications.length === 0 && (
          <EmptyState
            title="No applications found"
            description="Try changing the filter or revisit your current job listing."
            icon={<ListFilter className="h-8 w-8" />}
            size="md"
            className="mt-6"
          />
        )}

        {!loading && !error && applications.length > 0 && (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {visibleApplications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}
        {!loading && !error && applications.length > 0 && <Pagination page={page} pageSize={pageSize} total={applications.length} onPageChange={setPage} className="mt-6" />}
      </div>
    </section>
    </ErrorBoundary>
  )
}

