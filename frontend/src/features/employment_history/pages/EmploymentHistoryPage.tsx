import { ArrowRight, CheckCircle2, Clock3, FileText, ShieldCheck, UserRound } from 'lucide-react'
import { useMemo } from 'react'

import { useAuthStore } from '../../auth/store/authStore'
import { useEmploymentHistory } from '../hooks'

export function EmploymentHistoryPage() {
  const { user } = useAuthStore()
  const { records, loading, error } = useEmploymentHistory()

  const summary = useMemo(() => ({
    total: records.length,
    verified: records.filter((record) => record.verification_status === 'verified').length,
    pending: records.filter((record) => record.verification_status === 'pending').length,
    rejected: records.filter((record) => record.verification_status === 'rejected').length,
  }), [records])

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-[28px] bg-gradient-to-r from-[#0A2540] via-[#123860] to-[#0E2E4E] p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-200">Employment history</p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">{user?.is_worker ? 'Your work passport' : 'History verification desk'}</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200">
            <ShieldCheck className="h-4 w-4 text-[#FF6B00]" />
            {summary.total} records
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total" value={summary.total} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Verified" value={summary.verified} icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard label="Pending" value={summary.pending} icon={<Clock3 className="h-5 w-5" />} />
        <StatCard label="Rejected" value={summary.rejected} icon={<ShieldCheck className="h-5 w-5" />} />
      </div>

      <div className="card-kazilink p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Work history</h2>
            <p className="text-xs text-slate-500">Track prior roles and verification status.</p>
          </div>
        </div>

        {loading && <p className="mt-6 text-sm text-slate-500">Loading employment history...</p>}
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {!loading && !error && records.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
            No employment history found yet.
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="mt-6 space-y-4">
            {records.map((record) => (
              <article key={record.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <span className="inline-flex items-center justify-center rounded-lg bg-slate-100 p-2 text-[#0A2540]">{icon}</span>
      </div>
      <div className="mt-4 text-2xl font-black text-slate-900">{value}</div>
    </div>
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
