import { useState } from 'react'
import { ArrowRight, Briefcase, Building2, CheckCircle2, ChevronRight, ShieldCheck, Star, Users } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../auth'
import { useJobs } from '../../jobs/hooks'
import { Button } from '../../../shared/components/ui/Button'
import { LandingHero } from '../components'

const categories = [
  { value: 'Waiter', label: 'Waiters & Waitresses', count: 184 },
  { value: 'Bartender', label: 'Bartenders & Mixologists', count: 96 },
  { value: 'Barmaid', label: 'Barmaids', count: 142 },
  { value: 'Cleaner', label: 'Cleaners & Stewards', count: 210 },
  { value: 'Chef', label: 'Chefs & Cooks', count: 88 },
  { value: 'Barista', label: 'Baristas', count: 75 },
  { value: 'Security', label: 'Security & Bouncers', count: 64 },
]

const trustFeatures = [
  { icon: ShieldCheck, title: 'Verified onboarding', text: 'Every profile is checked for reliability, work history, and employer references.' },
  { icon: Users, title: 'Faster hiring', text: 'Find vetted staff for same-day bookings and recurring shifts without endless screening.' },
  { icon: Star, title: 'Transparent ratings', text: 'See worker reputation, attendance, and performance trends before you hire.' },
]

export function LandingPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [searchRole, setSearchRole] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const { jobs } = useJobs({ category: searchRole || undefined, location: searchLocation || undefined })

  if (user) return <Navigate to="/dashboard" replace />

  return (
    <main className="min-h-screen bg-slate-50">
      <LandingHero searchRole={searchRole} setSearchRole={setSearchRole} searchLocation={searchLocation} setSearchLocation={setSearchLocation} onSearch={() => navigate('/jobs')} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="card-kazilink flex flex-col justify-between p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-[#0A2540]/10 px-3 py-1 text-xs font-bold text-[#0A2540]">
                <Building2 className="h-3.5 w-3.5" />
                <span>For bar, lounge & hotel managers</span>
              </div>
              <h2 className="mb-3 font-display text-2xl font-black text-slate-900">Hire without ghosting or fake CVs</h2>
              <p className="mb-6 text-sm leading-relaxed text-slate-600">
                View worker reliability ratings, punctuality, and verified employment history from prior venue managers across Kenya.
              </p>
              <ul className="mb-8 space-y-3 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#FF6B00]" /> Instant access to manager references</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#FF6B00]" /> Verified identity and fraud protection</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#FF6B00]" /> Filter by shift type, location, and availability</li>
              </ul>
            </div>
            <Button variant="navy" size="lg" className="w-full justify-between" onClick={() => navigate('/register')}>
              <span>Explore verified workers</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#061829] p-8 text-white shadow-sm">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-[#FF6B00]/30 bg-[#FF6B00]/20 px-3 py-1 text-xs font-bold text-[#FF8F3D]">
                <Briefcase className="h-3.5 w-3.5" />
                <span>For hospitality & casual staff</span>
              </div>
              <h2 className="mb-3 font-display text-2xl font-black text-white">Build your verified work passport</h2>
              <p className="mb-6 text-sm leading-relaxed text-slate-300">
                Turn past shifts and supervisor references into a trusted profile that gets you noticed by top venues across Kenya.
              </p>
              <ul className="mb-8 space-y-3 text-xs font-medium text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#FF6B00]" /> Transparent pay rates in Kenyan Shillings</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#FF6B00]" /> Direct calls from restaurants and lounges</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#FF6B00]" /> Free registration with M-Pesa-ready payouts</li>
              </ul>
            </div>
            <Button variant="primary" size="lg" className="w-full justify-between bg-[#FF6B00] hover:bg-[#E55F00]" onClick={() => navigate('/register')}>
              <span>Browse hospitality shifts</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">Industry demand</p>
              <h2 className="font-display text-2xl font-black text-[#0A2540]">Popular hospitality categories</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/jobs')} rightIcon={<ArrowRight className="h-4 w-4" />}>
              View all roles
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => {
                  setSearchRole(category.value)
                  navigate('/jobs')
                }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-[#FED7AA] hover:bg-[#FFF4EB] group"
              >
                <div className="mb-2 text-2xl transition-transform group-hover:scale-110">✦</div>
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#FF6B00]">{category.label}</h3>
                <p className="mt-0.5 text-[10px] text-slate-500">{category.count} verified active</p>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B00]">Why employers choose KaziLink</p>
          <h2 className="mt-2 font-display text-3xl font-black text-slate-900">Built for reliability, speed, and peace of mind</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {trustFeatures.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF4EB] text-[#0A2540]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0A2540]">Live marketplace</p>
            <h2 className="font-display text-2xl font-black text-slate-900">Verified shifts ready to fill</h2>
          </div>
          <Link to="/jobs" className="flex items-center gap-1 text-xs font-bold text-[#FF6B00]">
            See all jobs <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.slice(0, 6).map((job) => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="card-kazilink p-5 transition hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-slate-900">{job.title}</h3>
                {job.is_urgent && <span className="badge-orange-tag text-[10px]">Urgent</span>}
              </div>
              <p className="mt-2 text-xs text-slate-500">{job.location} · {job.job_type}</p>
              <p className="mt-4 text-sm font-black text-[#0A2540]">KSh {job.pay_amount_ksh.toLocaleString()} / {job.pay_period}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-[#0A2540] px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-3 font-display text-2xl font-black text-white sm:text-3xl">How the KaziLink trust system works</h2>
            <p className="text-xs text-slate-300 sm:text-sm">Browse profiles, verify references, and build better working relationships with less risk.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              ['1', 'Browse free profiles', 'Review worker skills, rates, and reliability history before reaching out.'],
              ['2', 'Unlock references', 'Use the secure M-Pesa verification flow to reveal detailed employment records.'],
              ['3', 'Book with confidence', 'Confirm the role, pay safely, and keep the network accountable through ratings.'],
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B00] font-display text-base font-black text-white">{number}</div>
                <h3 className="mb-2 text-base font-bold text-white">{title}</h3>
                <p className="text-xs leading-relaxed text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
