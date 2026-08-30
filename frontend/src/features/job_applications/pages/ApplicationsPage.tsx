import { ArrowRight, Briefcase, FileText, Filter, ListFilter } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useAuthStore } from '../../auth/store/authStore'
import { ApplicationCard, ApplicationStatusBadge } from '../components'
import { useApplications } from '../hooks'
import type { ApplicationFilters, JobApplicationStatus } from '../types'

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
  const isEmployer = Boolean(user?.is_employer && !user?.is_worker)
  const isWorker = Boolean(user?.is_worker)
  const isAdmin = Boolean(user?.is_staff || user?.is_superuser)

  const scope = isAdmin ? 'admin' : isEmployer ? 'employer' : isWorker ? 'mine' : 'mine'
  const filters: ApplicationFilters = statusFilter ? { status: statusFilter } : {}
  const { applications, loading, error } = useApplications(scope, filters)

  const counts = useMemo(() => ({
    total: applications.length,
    shortlisted: applications.filter((application) => application.status === 'shortlisted').length,
    interview: applications.filter((application) => application.status === 'interview_scheduled').length,
    hired: applications.filter((application) => application.status === 'hired').length,
  }), [applications])

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-[28px] bg-gradient-to-r from-[#0A2540] via-[#123860] to-[#0E2E4E] p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-200">Applications</p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              {isEmployer ? 'Applicant pipeline' : isAdmin ? 'Marketplace applications' : 'My applications'}
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200">
            <Briefcase className="h-4 w-4 text-[#FF6B00]" />
            {counts.total} total records
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total" value={counts.total} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Shortlisted" value={counts.shortlisted} icon={<ApplicationStatusBadge status="shortlisted" />} />
        <StatCard label="Interviews" value={counts.interview} icon={<ApplicationStatusBadge status="interview_scheduled" />} />
        <StatCard label="Hired" value={counts.hired} icon={<ApplicationStatusBadge status="hired" />} />
      </div>

      <div className="card-kazilink p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Review applications</h2>
            <p className="text-xs text-slate-500">Track outstanding candidate activity and next steps.</p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as JobApplicationStatus | '')}
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
              aria-label="Filter applications by status"
            >
              {statusOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value}>{option.label}</option>
              ))}
            </select>
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
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <span className="inline-flex items-center justify-center rounded-lg bg-slate-100 p-2 text-[#0A2540]">{icon}</span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <span className="text-2xl font-black text-slate-900">{value}</span>
        <ArrowRight className="h-4 w-4 text-[#FF6B00]" />
      </div>
    </div>
  )
}
