import { ArrowRight, Briefcase, MapPin, Sparkles, TimerReset } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Job } from '../types'
import { Badge } from '../../../shared/components/ui/Badge'

export function JobCard({ job }: { job: Job }) {
  const categoryLabel = job.category || 'Hospitality'
  const jobTypeLabel = job.job_type?.replace(/_/g, ' ') || 'shift'

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#FFB380] hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant="orange" size="sm">{categoryLabel}</Badge>
          <h2 className="mt-3 text-lg font-black text-slate-900">{job.title}</h2>
        </div>
        {job.is_urgent && (
          <Badge variant="danger" size="sm">Urgent</Badge>
        )}
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#0A2540]" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-[#0A2540]" />
          <span>{jobTypeLabel}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Rate</p>
          <p className="text-xl font-black text-[#0A2540]">
            KSh {job.pay_amount_ksh?.toLocaleString() ?? '0'}
            <span className="ml-1 text-sm font-semibold text-slate-500">/{job.pay_period || 'shift'}</span>
          </p>
        </div>
        <div className="text-right text-[11px] text-slate-500">
          <p className="flex items-center justify-end gap-1">
            <Sparkles className="h-3.5 w-3.5 text-[#FF6B00]" />
            {job.is_featured ? 'Featured' : 'Open'}
          </p>
          <p className="mt-1 flex items-center justify-end gap-1">
            <TimerReset className="h-3.5 w-3.5 text-slate-400" />
            {job.applicant_count ?? 0} applicants
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="text-xs text-slate-500">{job.status || 'Open'} role</div>
        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A2540] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#123860]"
        >
          View details
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  )
}