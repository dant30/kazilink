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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total" value={counts.total} subtitle="Applications received" icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Shortlisted" value={counts.shortlisted} subtitle="Candidates to review" icon={<ApplicationStatusBadge status="shortlisted" />} iconBg="bg-orange-50 text-[#FF6B00]" />
        <StatCard title="Interviews" value={counts.interview} subtitle="Scheduled conversations" icon={<ApplicationStatusBadge status="interview_scheduled" />} iconBg="bg-sky-50 text-sky-600" />
        <StatCard title="Hired" value={counts.hired} subtitle="Successful applications" icon={<ApplicationStatusBadge status="hired" />} iconBg="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="card-kazilink p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Review applications</h2>
            <p className="text-xs text-slate-500">Track outstanding candidate activity and next steps.</p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select value={statusFilter} onChange={(value) => { setStatusFilter(value as JobApplicationStatus | ''); setPage(1) }} options={statusOptions} className="flex-1" />
          </div>
        </div>

        {loading && <p className="mt-6 text-sm text-slate-500">Loading applications...</p>}
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {!loading && !error && applications.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <ListFilter className="mx-auto h-8 w-8 text-slate-300" />
            <h3 className="mt-3 text-base font-black text-slate-800">No applications found</h3>
            <p className="mt-1 text-sm text-slate-500">Try changing the filter or revisit your current job listing.</p>
          </div>
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

