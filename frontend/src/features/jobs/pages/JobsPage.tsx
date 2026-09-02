import { ArrowRight, Briefcase, MapPin, Search, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Pagination } from '../../../shared/components/ui/Pagination'
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

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Live roles</p>
          <p className="mt-2 text-2xl font-black text-[#0A2540]">{jobs.length}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Verified employers</p>
          <p className="mt-2 text-2xl font-black text-[#0A2540]">24/7</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Fast response</p>
          <p className="mt-2 text-2xl font-black text-[#0A2540]">Same day</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
          <Search className="h-4 w-4" />
          {isEmployer ? 'Manage hiring needs' : 'Search roles'}
        </div>
        <JobFilters filters={filters} onChange={updateFilters} />
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          Loading opportunities...
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
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
              No open jobs match these filters. Try adjusting the search criteria.
            </div>
          )}
          <Pagination page={page} pageSize={pageSize} total={jobs.length} onPageChange={setPage} />
        </div>
      )}
    </section>
  )
}