import { CheckCircle2, Clock3, FileText, UserRound } from 'lucide-react'

import type { EmploymentRecord } from '../types'
import { Badge } from '../../../shared/components/ui/Badge'

export function EmploymentHistoryCard({ record }: { record: EmploymentRecord }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{record.establishment_type || 'Hospitality'}</p>
          <h3 className="mt-2 text-lg font-black text-slate-900">{record.establishment_name}</h3>
          <p className="mt-1 text-sm text-slate-600">{record.position}</p>
        </div>
        <StatusBadge status={record.verification_status} />
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-[#FF6B00]" /> {record.worker_name || 'Worker'}</div>
        <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-[#FF6B00]" /> {record.location}</div>
        <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#FF6B00]" /> {record.start_date} {record.end_date ? `– ${record.end_date}` : ''}</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#FF6B00]" /> {record.is_current ? 'Current role' : 'Previous role'}</div>
      </div>
    </article>
  )
}

export function StatusBadge({ status }: { status: 'pending' | 'verified' | 'rejected' | string }) {
  const variant = status === 'verified' ? 'success' : status === 'pending' ? 'warning' : status === 'rejected' ? 'danger' : 'neutral'
  return <Badge variant={variant} size="sm" className="capitalize">{status.replace(/_/g, ' ')}</Badge>
}
