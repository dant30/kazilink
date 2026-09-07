import { ArrowRight, Calendar, FileText, MapPin, User } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { JobApplication } from '../types'
import { ApplicationStatusBadge } from './ApplicationStatusBadge'

export function ApplicationCard({ application }: { application: JobApplication }) {
  return (
    <Link
      to={`/applications/${application.id}`}
      className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md sm:p-5"
    >
      <div>
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">Candidate Application</p>
            <h3 className="mt-1 truncate text-base font-black text-slate-900 transition-colors group-hover:text-[#FF6B00] sm:text-lg">{application.job_title || 'Hospitality Role'}</h3>
          </div>
          <div className="shrink-0"><ApplicationStatusBadge status={application.status} /></div>
        </div>
        <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 sm:text-sm"><div className="flex items-center gap-2"><User className="h-4 w-4 shrink-0 text-[#FF6B00]" /><span className="font-semibold text-slate-900">{application.worker_name || 'Worker'}</span></div><div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-slate-400" /><span className="truncate">{application.employer_name || 'Hospitality Venue'}</span></div><div className="flex items-center gap-2 text-[11px] text-slate-500"><Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" /><span>Applied on {new Date(application.applied_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span></div></div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs"><div className="inline-flex items-center gap-1.5 font-medium text-slate-500"><FileText className="h-3.5 w-3.5 text-[#0A2540]" /><span>{application.cover_note ? 'Cover note' : 'Profile application'}</span></div><span className="inline-flex min-h-[36px] items-center gap-1 font-bold text-[#FF6B00] transition-transform group-hover:translate-x-0.5"><span>Review</span><ArrowRight className="h-3.5 w-3.5" /></span>
      </div>
    </Link>
  )
}
