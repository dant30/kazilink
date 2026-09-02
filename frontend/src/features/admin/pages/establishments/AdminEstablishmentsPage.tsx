import { ArrowRight, Building2, CheckCircle2, MapPin, Search, ShieldCheck, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useEstablishments } from '../../../establishments/hooks'
import type { Establishment } from '../../../establishments/types'
import { StatCard } from '../../../../shared/components/cards/StatCard'
import { PageHeader } from '../../../../shared/components/ui/PageHeader'

export function AdminEstablishmentsPage() {
  const [query, setQuery] = useState('')
  const { establishments, loading, error } = useEstablishments({ q: query })

  const summary = useMemo(() => ({
    total: establishments.length,
    verified: establishments.filter((item) => item.is_verified).length,
    pending: establishments.filter((item) => !item.is_verified).length,
  }), [establishments])

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Admin oversight"
        title="Establishment verification queue"
        actions={
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200">
            <ShieldCheck className="h-4 w-4 text-[#FF6B00]" />
            {summary.total} venues tracked
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total" value={summary.total} subtitle="Venues tracked" icon={<Building2 className="h-5 w-5" />} />
        <StatCard title="Verified" value={summary.verified} subtitle="Approved venues" icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" />
        <StatCard title="Pending" value={summary.pending} subtitle="Awaiting verification" icon={<XCircle className="h-5 w-5" />} iconBg="bg-amber-50 text-amber-600" />
      </div>

      <div className="card-kazilink p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Review incoming establishment records</h2>
            <p className="text-xs text-slate-500">Check verification status and flag incomplete records.</p>
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search venue or location"
              className="w-56 bg-transparent outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        {loading && <p className="mt-6 text-sm text-slate-500">Loading venue records...</p>}
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {!loading && !error && (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {establishments.map((establishment) => (
              <AdminEstablishmentCard key={establishment.id} establishment={establishment} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function AdminEstablishmentCard({ establishment }: { establishment: Establishment }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{establishment.establishment_type || 'Venue'}</p>
          <h3 className="mt-2 text-lg font-black text-slate-900">{establishment.name}</h3>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${establishment.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {establishment.is_verified ? 'Verified' : 'Pending'}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#FF6B00]" /> {establishment.location}</div>
        <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-[#FF6B00]" /> {establishment.address}</div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs font-medium text-slate-500">{establishment.verified_employers_count ?? 0} verified employers</span>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B00]"
        >
          Review <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  )
}

