import { ArrowRight, Briefcase, Building2, MapPin, Search, Sparkles, TimerReset } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { StatCard } from '../../../shared/components/cards/StatCard'
import { ErrorBoundary } from '../../../shared/components/ui/ErrorBoundary'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { EmptyState } from '../../../shared/components/feedback'
import { useAuthStore } from '../../auth/store/authStore'
import { JobCard, JobFilters } from '../components'
import { useJobs } from '../hooks'
import type { JobFilters as JobFilterValues } from '../services'

export function JobsPage() {
  const { user } = useAuthStore()
  const isEmployer = Boolean(user?.is_employer)
  const isWorker = Boolean(user?.is_worker)
  const [filters, setFilters] = useState<JobFilterValues>({ q: '', location: '', category: '', job_type: '' })
  const [page, setPage] = useState(1)
  const { jobs, loading, error } = useJobs(filters)
  const pageSize = 9
  const visibleJobs = useMemo(() => jobs.slice((page - 1) * pageSize, page * pageSize), [jobs, page])
  const employerCount = useMemo(() => new Set(jobs.map((job) => job.employer)).size, [jobs])
  const urgentJobCount = useMemo(() => jobs.filter((job) => job.is_urgent).length, [jobs])

  const updateFilters = (nextFilters: JobFilterValues) => {
    setFilters(nextFilters)
    setPage(1)
  }

  const heroTitle = isEmployer
    ? 'Hire trusted hospitality talent faster.'
    : isWorker
      ? 'Find work that fits your schedule.'
      : 'Discover verified hospitality roles.'

  const heroDescription = isEmployer
    ? 'Post new roles, review applicants, and build a stronger team with trusted local talent.'
    : isWorker
      ? 'Browse shifts, weekend gigs, and full-time roles from verified employers across Kenya.'
      : 'Search current openings, compare pay, and apply to roles that match your availability.'

  return (
    <ErrorBoundary>
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow={isEmployer ? 'Employer marketplace' : isWorker ? 'Worker marketplace' : 'KaziLink marketplace'}
        title={heroTitle}
        description={heroDescription}
        icon={<Sparkles className="h-4 w-4" />}
        actions={
          isEmployer ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/jobs/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E55F00]"
              >
                <Briefcase className="h-4 w-4" />
                Post a job
              </Link>
            </div>
          ) : (
            <Link
              to={user ? '/applications' : '/login'}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E55F00]"
            >
              <Briefcase className="h-4 w-4" />
              {user ? 'My applications' : 'Sign in to apply'}
            </Link>
          )
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {loading ? Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-24 rounded-2xl" />) : <>
          <StatCard title="Live roles" value={jobs.length} subtitle="Current marketplace listings" icon={<Briefcase className="h-5 w-5" />} />
          <StatCard title="Employers" value={employerCount} subtitle="Employers represented" icon={<Building2 className="h-5 w-5" />} iconBg="bg-orange-50 text-[#FF6B00]" />
          <StatCard title="Urgent roles" value={urgentJobCount} subtitle="Roles needing a quick hire" icon={<TimerReset className="h-5 w-5" />} iconBg="bg-amber-50 text-amber-600" />
        </>}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
          <Search className="h-4 w-4" />
          {isEmployer ? 'Manage hiring needs' : 'Search roles'}
        </div>
        <JobFilters filters={filters} onChange={updateFilters} />
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading opportunities" aria-busy="true">
          {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-64 rounded-2xl" />)}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-medium text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <MapPin className="h-4 w-4 text-[#FF6B00]" />
              {jobs.length ? `${jobs.length} positions found` : 'No results yet'}
            </div>
            <Link to="/jobs" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-[#0A2540]">
              Refresh
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {jobs.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No open jobs match these filters"
              description="Try adjusting the search criteria."
              icon={<Briefcase className="h-8 w-8" />}
              action={isEmployer ? <Link to="/jobs/new" className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E55F00]"><Briefcase className="h-4 w-4" />Post a job</Link> : undefined}
            />
          )}
          <Pagination page={page} pageSize={pageSize} total={jobs.length} onPageChange={setPage} />
        </div>
      )}
      </section>
    </ErrorBoundary>
  )
}