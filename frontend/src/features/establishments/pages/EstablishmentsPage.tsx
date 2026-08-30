import { ArrowRight, Building2, MapPin, Search, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useEstablishments } from '../hooks'
import type { EstablishmentFilters } from '../types'

export function EstablishmentsPage() {
  const [filters, setFilters] = useState<EstablishmentFilters>({ q: '', type: '' })
  const { establishments, loading, error } = useEstablishments(filters)

  const spotlight = useMemo(
    () => establishments.filter((item) => item.is_verified).slice(0, 3),
    [establishments],
  )

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-[28px] bg-gradient-to-r from-[#0A2540] via-[#123860] to-[#0E2E4E] p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-200">Establishments</p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Verified hospitality venues</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200">
            <Sparkles className="h-4 w-4 text-[#FF6B00]" />
            {establishments.length} listings
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <OverviewCard label="Verified" value={establishments.filter((item) => item.is_verified).length} icon={<ShieldCheck className="h-5 w-5" />} />
        <OverviewCard label="Locations" value={new Set(establishments.map((item) => item.location)).size} icon={<MapPin className="h-5 w-5" />} />
        <OverviewCard label="Profiles" value={establishments.reduce((sum, item) => sum + (item.verified_employers_count ?? 0), 0)} icon={<Building2 className="h-5 w-5" />} />
      </div>

      <div className="card-kazilink p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Search establishments</h2>
            <p className="text-xs text-slate-500">Find trusted venues and verify their operating profile.</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={filters.q ?? ''}
                onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
                placeholder="Search by name or address"
                className="w-44 bg-transparent outline-none placeholder:text-slate-400"
              />
            </label>
            <select
              value={filters.type ?? ''}
              onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
            >
              <option value="">All types</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Hotel">Hotel</option>
              <option value="Cafe">Cafe</option>
              <option value="Hospitality">Hospitality</option>
            </select>
          </div>
        </div>

        {loading && <p className="mt-6 text-sm text-slate-500">Loading establishments...</p>}
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {!loading && !error && (
          <div className="mt-6 space-y-5">
            {spotlight.length > 0 && (
              <div className="grid gap-4 lg:grid-cols-3">
                {spotlight.map((establishment) => (
                  <FeaturedEstablishmentCard key={establishment.id} establishment={establishment} />
                ))}
              </div>
            )}

            {establishments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
                No establishments match your search.
              </div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {establishments.map((establishment) => (
                  <Link key={establishment.id} to={`/establishments/${establishment.id}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
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
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B00]">
                        View profile <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function OverviewCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
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

function FeaturedEstablishmentCard({ establishment }: { establishment: { id: number; name: string; location: string; establishment_type: string; is_verified: boolean } }) {
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">Featured</p>
      <h3 className="mt-2 text-lg font-black text-slate-900">{establishment.name}</h3>
      <p className="mt-2 text-sm text-slate-600">{establishment.establishment_type} · {establishment.location}</p>
      <Link to={`/establishments/${establishment.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#FF6B00]">
        Explore venue <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
