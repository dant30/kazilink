// frontend/src/features/home/components/LandingHero.tsx
import type { Dispatch, SetStateAction } from 'react'
import { ArrowRight, MapPin, Search, ShieldCheck } from 'lucide-react'

import { HeroParticles } from './HeroParticles'
import { Select } from '../../../shared/components/ui/Select'

export interface LandingHeroProps {
  searchRole: string
  setSearchRole: Dispatch<SetStateAction<string>>
  searchLocation: string
  setSearchLocation: Dispatch<SetStateAction<string>>
  onSearch: () => void
  roleOptions: Array<{ value: string; label: string }>
  liveJobs: number
}

export function LandingHero({ searchRole, setSearchRole, searchLocation, setSearchLocation, onSearch, roleOptions, liveJobs }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A2540] via-[#081F36] to-[#051424] py-16 text-white sm:py-24">
      <HeroParticles />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10 [background-image:radial-gradient(#FF6B00_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF6B00]" />
            <ShieldCheck className="h-4 w-4 text-[#FF6B00]" />
            <span>Trust + Speed for Kenya's Hospitality Sector Nationwide</span>
          </div>
          <h1 className="font-display text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find reliable workers near you with <span className="text-[#FF8F3D]">verified experience</span> when you need it.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Connecting Kenyan bars, lounges, restaurants, hotels, and event businesses with vetted hospitality professionals.
          </p>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-2.5 text-slate-800 shadow-2xl sm:flex-row sm:p-3.5">
            <label className="flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:w-1/2">
              <Search className="h-4 w-4 shrink-0 text-[#0A2540]" />
              <span className="sr-only">Hospitality role</span>
              <Select searchable aria-label="Worker role" value={searchRole} onChange={setSearchRole} options={[{ value: '', label: 'All worker roles' }, ...roleOptions]} className="flex-1" />
            </label>
            <label className="flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:w-1/2">
              <MapPin className="h-4 w-4 shrink-0 text-[#0A2540]" />
              <span className="sr-only">Location</span>
              <Select aria-label="Location" value={searchLocation} onChange={setSearchLocation} options={[{ value: '', label: 'All Kenya Locations' }, { value: 'Nairobi', label: 'Nairobi' }, { value: 'Mombasa', label: 'Mombasa & Coast' }, { value: 'Nakuru', label: 'Nakuru & Rift Valley' }, { value: 'Kisumu', label: 'Kisumu & Western' }]} className="flex-1" />
            </label>
            <button type="button" onClick={onSearch} className="btn-primary-orange w-full shrink-0 text-sm sm:w-auto">
              <span>Search Candidates</span><ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-8 text-left sm:grid-cols-4">
            {[[String(liveJobs), 'Live opportunities'], [String(roleOptions.length), 'Role categories'], ['2', 'Roles supported'], ['24/7', 'Profile access']].map(([value, label]) => (
              <div className="p-2" key={label}><p className="font-display text-2xl font-black text-[#FF6B00] sm:text-3xl">{value}</p><p className="mt-0.5 text-xs text-slate-400">{label}</p></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}