import { ArrowLeft, Building2, CheckCircle2, MapPin, ShieldCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { useEstablishment } from '../hooks'

export function EstablishmentDetailPage() {
  const { establishmentId } = useParams()
  const { establishment, loading, error } = useEstablishment(Number(establishmentId))

  if (loading) {
    return <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"><div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">Loading establishment...</div></section>
  }

  if (error || !establishment) {
    return <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"><div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-sm font-medium text-rose-700">{error || 'Establishment not found.'}</p><Link to="/establishments" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0A2540]"><ArrowLeft className="h-4 w-4" /> Back to establishments</Link></div></section>
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/establishments" className="inline-flex items-center gap-2 text-sm font-bold text-[#0A2540]"><ArrowLeft className="h-4 w-4" /> All establishments</Link>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#0A2540] via-[#123860] to-[#0E2E4E] p-6 text-white sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">{establishment.establishment_type || 'Venue'}</span>
              <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">{establishment.name}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-200">
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#FF6B00]" /> {establishment.location}</span>
                <span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-[#FF6B00]" /> {establishment.address}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">Verification</p>
              <p className="mt-2 inline-flex items-center gap-2 text-xl font-black text-white">
                {establishment.is_verified ? <CheckCircle2 className="h-5 w-5 text-emerald-300" /> : <ShieldCheck className="h-5 w-5 text-amber-300" />}
                {establishment.is_verified ? 'Verified' : 'Pending'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2 lg:p-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-black text-slate-900">Overview</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              This establishment is listed as a trusted hospitality venue in {establishment.location}. It is positioned to support hiring, verification, and recruitment coordination.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-black text-slate-900">Profile summary</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between gap-3"><span>Type</span><span className="font-semibold text-slate-900">{establishment.establishment_type || 'General hospitality'}</span></div>
              <div className="flex justify-between gap-3"><span>Location</span><span className="font-semibold text-slate-900">{establishment.location}</span></div>
              <div className="flex justify-between gap-3"><span>Verified employers</span><span className="font-semibold text-slate-900">{establishment.verified_employers_count ?? 0}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
