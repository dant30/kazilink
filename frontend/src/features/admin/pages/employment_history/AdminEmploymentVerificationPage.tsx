import { ArrowRight, CheckCircle2, Clock3, FileText, ShieldCheck, XCircle } from 'lucide-react'
import { useMemo } from 'react'

import { useVerificationQueue } from '../../../employment_history/hooks'
import type { EmploymentRecord } from '../../../employment_history/types'
import { StatCard } from '../../../../shared/components/cards/StatCard'
import { PageHeader } from '../../../../shared/components/ui/PageHeader'

export function AdminEmploymentVerificationPage() {
  const { records, loading, error } = useVerificationQueue()

  const summary = useMemo(() => ({
    total: records.length,
    verified: records.filter((record) => record.verification_status === 'verified').length,
    pending: records.filter((record) => record.verification_status === 'pending').length,
    rejected: records.filter((record) => record.verification_status === 'rejected').length,
  }), [records])

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Trust & verification"
        title="Employment history verification"
        actions={
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200">
            <ShieldCheck className="h-4 w-4 text-[#FF6B00]" />
            {summary.total} records under review
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total" value={summary.total} subtitle="Records in the queue" icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Verified" value={summary.verified} subtitle="Approved records" icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" />
        <StatCard title="Pending" value={summary.pending} subtitle="Awaiting review" icon={<Clock3 className="h-5 w-5" />} iconBg="bg-amber-50 text-amber-600" />
        <StatCard title="Rejected" value={summary.rejected} subtitle="Require attention" icon={<XCircle className="h-5 w-5" />} iconBg="bg-rose-50 text-rose-600" />
      </div>

      <div className="card-kazilink p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Review work passport entries</h2>
            <p className="text-xs text-slate-500">Confirm references, flag mismatches, and approve trustworthy employment records.</p>
          </div>
        </div>

        {loading && <p className="mt-6 text-sm text-slate-500">Loading verification queue...</p>}
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {!loading && !error && records.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
            The verification queue is clear.
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="mt-6 space-y-4">
            {records.map((record) => (
              <AdminVerificationCard key={record.id} record={record} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function AdminVerificationCard({ record }: { record: EmploymentRecord }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{record.establishment_type || 'Employer'}</p>
          <h3 className="mt-2 text-lg font-black text-slate-900">{record.establishment_name}</h3>
          <p className="mt-1 text-sm text-slate-600">{record.position} · {record.location}</p>
        </div>
        <StatusBadge status={record.verification_status} />
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-[#FF6B00]" /> {record.worker_name || 'Worker'}</div>
        <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#FF6B00]" /> {record.start_date} {record.end_date ? `– ${record.end_date}` : ''}</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#FF6B00]" /> {record.is_current ? 'Current role' : 'Previous role'}</div>
        <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#FF6B00]" /> {record.reference_contact_name}</div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs font-medium text-slate-500">Reference contact: {record.reference_contact_phone}</span>
        <button type="button" className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B00]">
          Review record <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  )
}

function StatusBadge({ status }: { status: 'pending' | 'verified' | 'rejected' | string }) {
  const palette = {
    pending: 'bg-amber-100 text-amber-700',
    verified: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-rose-100 text-rose-700',
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${palette[status as keyof typeof palette] ?? 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  )
}

