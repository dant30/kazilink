import type { JobApplicationStatus } from '../types'

const statusStyles: Record<JobApplicationStatus, string> = {
  applied: 'bg-sky-50 text-sky-700 ring-sky-200',
  shortlisted: 'bg-amber-50 text-amber-700 ring-amber-200',
  interview_scheduled: 'bg-violet-50 text-violet-700 ring-violet-200',
  hired: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
}

const statusLabels: Record<JobApplicationStatus, string> = {
  applied: 'Applied',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview scheduled',
  hired: 'Hired',
  rejected: 'Rejected',
}

export function ApplicationStatusBadge({ status }: { status: JobApplicationStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ring-1 ring-inset ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  )
}
