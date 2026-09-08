import { ArrowRight, Briefcase, MapPin, Sparkles, TimerReset } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Job } from '../types'
import { Badge } from '../../../shared/components/ui/Badge'

export function JobCard({ job }: { job: Job }) {
  const categoryLabel = job.category || 'Hospitality'
  const jobTypeLabel = job.job_type?.replace(/_/g, ' ') || 'shift'

  return (
    <article className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#FF6B00]/40 hover:shadow-md sm:p-5">
      <div>
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-1.5"><Badge variant="orange" size="sm">{categoryLabel}</Badge>{job.is_featured && <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800"><Sparkles className="h-3 w-3 text-amber-500" />Featured</span>}</div><h2 className="mt-2 line-clamp-2 text-base font-black tracking-tight text-slate-900 group-hover:text-[#FF6B00] sm:text-lg">{job.title}</h2></div>
          {job.is_urgent && <Badge variant="danger" size="sm" className="shrink-0 animate-pulse">Urgent</Badge>}
        </div>
        <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 sm:text-sm"><div className="flex min-w-0 items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-[#FF6B00]" /><span className="truncate">{job.location}</span></div><div className="flex min-w-0 items-center gap-2"><Briefcase className="h-4 w-4 shrink-0 text-slate-400" /><span className="truncate capitalize">{jobTypeLabel}</span></div></div>
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3.5">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">Pay Rate</p><p className="text-lg font-black text-[#0A2540] sm:text-xl">
            KSh {job.pay_amount_ksh?.toLocaleString() ?? '0'}
            <span className="ml-1 text-[11px] font-semibold text-slate-500">/{job.pay_period || 'shift'}</span>
          </p>
        </div>
        <div className="shrink-0 text-right text-[11px] text-slate-500"><p className="flex items-center justify-end gap-1 whitespace-nowrap font-medium"><TimerReset className="h-3.5 w-3.5 shrink-0 text-[#FF6B00]" /><span>{job.applicant_count ?? 0} applicants</span></p><p className="mt-0.5 whitespace-nowrap text-[10px] font-semibold text-emerald-600">M-Pesa payouts</p></div>
      </div>
      <div className="mt-3.5 flex min-w-0 items-center justify-between gap-2 border-t border-slate-100/80 pt-3"><div className="truncate text-xs font-semibold text-slate-500">{job.status || 'Open'} role</div>
        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-xl bg-[#0A2540] px-3.5 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-[#FF6B00] active:scale-[0.98] sm:min-h-[42px]"
        ><span>View details</span><ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      </div>
    </article>
  )
}