import { ArrowRight, Calendar, FileText, MapPin, User } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { JobApplication } from '../types'
import { ApplicationStatusBadge } from './ApplicationStatusBadge'

export function ApplicationCard({ application }: { application: JobApplication }) {
  return (
    <Link
      to={`/applications/${application.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Application</p>
          <h3 className="mt-2 text-lg font-black text-slate-900">{application.job_title || 'Role application'}</h3>
        </div>
        <ApplicationStatusBadge status={application.status} />
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-[#FF6B00]" />
          <span>{application.worker_name || 'Worker'} </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#FF6B00]" />
          <span>{application.employer_name || 'Employer'} </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#FF6B00]" />
          <span>{new Date(application.applied_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500">
          <FileText className="h-4 w-4 text-[#0A2540]" />
          {application.cover_note ? 'Cover note attached' : 'No cover note'}
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B00]">
          View details <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
