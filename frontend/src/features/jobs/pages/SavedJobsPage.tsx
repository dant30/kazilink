import { Bookmark, Briefcase } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { endpoints } from '../../../core/api'
import { EmptyState } from '../../../shared/components/feedback'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { JobCard } from '../components'
import type { Job } from '../types'

export function SavedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    endpoints.jobs.saved().then(setJobs).catch((reason: Error) => setError(reason.message)).finally(() => setLoading(false))
  }, [])

  return <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"><PageHeader eyebrow="Worker workspace" title="Saved jobs" description="Keep promising roles close while you compare your options." icon={<Bookmark className="h-5 w-5" />} /><Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-[#0A2540]"><Briefcase className="h-4 w-4" />Browse all jobs</Link>{loading && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-64 rounded-2xl" />)}</div>}{error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}{!loading && !error && (jobs.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{jobs.map((job) => <JobCard key={job.id} job={job} />)}</div> : <EmptyState title="No saved jobs yet" description="Save roles you want to revisit while searching." icon={<Bookmark className="h-8 w-8" />} />)}</section>
}