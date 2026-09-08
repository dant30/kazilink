import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Heart,
  MapPin,
  Phone,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
  Briefcase,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { useEstablishment } from '../hooks'
import { listJobs } from '../../jobs/services/jobs'
import type { Job } from '../../jobs/types'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { Tabs } from '../../../shared/components/ui/Tabs'
import { Button } from '../../../shared/components/ui/Button'
import { toast } from '../../../shared/components/feedback'
import { useAuthStore } from '../../auth/store/authStore'
import { formatRelativeTime } from '../../../core/utils'

export function EstablishmentDetailPage() {
  const { establishmentId } = useParams()
  const { user } = useAuthStore()
  const { establishment, loading, error } = useEstablishment(Number(establishmentId))
  const [activeTab, setActiveTab] = useState('overview')
  const [venueJobs, setVenueJobs] = useState<Job[]>([])
  const [jobsLoading, setJobsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const isEmployer = Boolean(user?.is_employer)

  useEffect(() => {
    if (!establishment?.name) return
    let active = true
    setJobsLoading(true)

    listJobs({ q: establishment.name })
      .then((data) => {
        if (!active) return
        const jobs = Array.isArray(data) ? data : (data as { results?: Job[] }).results ?? []
        setVenueJobs(jobs)
      })
      .catch(() => {
        if (!active) return
        setVenueJobs([])
      })
      .finally(() => {
        if (!active) return
        setJobsLoading(false)
      })

    return () => {
      active = false
    }
  }, [establishment?.name])

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        toast.success('Link copied', 'Establishment profile link copied to clipboard.')
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      toast.info('Share URL', window.location.href)
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-3.5 sm:px-6 lg:px-8 py-8 space-y-4" aria-busy="true">
        <Skeleton className="h-10 w-40 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
      </section>
    )
  }

  if (error || !establishment) {
    return (
      <section className="mx-auto max-w-5xl px-3.5 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <p className="text-sm font-semibold text-rose-700">{error || 'Establishment not found.'}</p>
          <Link
            to="/establishments"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0A2540] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#123860]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to establishments
          </Link>
        </div>
      </section>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'shifts', label: `Active Shifts (${venueJobs.length})` },
    { id: 'trust', label: 'Trust & Safety' },
    { id: 'location', label: 'Location & Access' },
  ]

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 sm:pb-12">
      <div className="flex items-center justify-between gap-2">
        <Link
          to="/establishments"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4 text-[#FF6B00]" /> All establishments
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        >
          <Share2 className="h-3.5 w-3.5 text-[#FF6B00]" />
          <span>{copied ? 'Copied!' : 'Share'}</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="relative bg-gradient-to-br from-[#0A2540] via-[#0D2E50] to-[#081827] p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-200 border border-white/10">
                  {establishment.establishment_type || 'Hospitality Venue'}
                </span>
                {establishment.is_verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Establishment
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                    <Clock className="h-3.5 w-3.5" />
                    Verification In Review
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                {establishment.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#FF6B00]" /> {establishment.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-[#FF6B00]" /> {establishment.address}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 sm:p-5 backdrop-blur-sm border border-white/10 shrink-0 sm:min-w-[200px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Registered Managers</p>
              <p className="mt-1 text-2xl font-black text-white">
                {establishment.verified_employers_count ?? 1}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">Authorized for shift bookings</p>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 px-4 sm:px-8 bg-slate-50/50">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-5 sm:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900 mb-2">Venue Overview</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                  {establishment.name} is a premier hospitality destination located in {establishment.location}. Partnered with KaziLink, this venue hires reference-verified bartenders, baristas, waitstaff, chefs, and event crews backed by instant M-Pesa escrow guarantees.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-center gap-2.5 text-[#FF6B00] mb-1.5">
                    <ShieldCheck className="h-5 w-5" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Reference Certified</h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    All casual shifts booked at this establishment undergo standard reference verification.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-center gap-2.5 text-emerald-600 mb-1.5">
                    <CheckCircle2 className="h-5 w-5" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Escrow Protected</h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    Shift compensation is locked before shift start and disbursed immediately after sign-off.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2.5 text-blue-600 mb-1.5">
                    <Users className="h-5 w-5" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Direct Staffing</h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    Fast on-call dispatch for peak weekend rushes and private hospitality bookings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shifts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Open Shifts at {establishment.name}</h3>
                  <p className="text-xs text-slate-500">Available casual shifts you can apply for today.</p>
                </div>
                {isEmployer && (
                  <Link
                    to="/jobs/new"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF6B00] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#E55F00]"
                  >
                    + Post shift
                  </Link>
                )}
              </div>

              {jobsLoading && (
                <div className="space-y-3" aria-busy="true">
                  <Skeleton className="h-24 w-full rounded-2xl" />
                  <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
              )}

              {!jobsLoading && venueJobs.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                  <Briefcase className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-700">No active shifts right now</p>
                  <p className="text-xs text-slate-500 mt-1">
                    There are currently no open shifts posted under {establishment.name}. Check back soon or explore other shifts.
                  </p>
                  <Link
                    to="/jobs"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0A2540] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#123860]"
                  >
                    Browse all casual shifts
                  </Link>
                </div>
              )}

              {!jobsLoading && venueJobs.length > 0 && (
                <div className="space-y-3">
                  {venueJobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-[#FF6B00] hover:shadow-xs"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]">
                          {job.category || 'Casual Shift'}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors">
                          {job.title}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(job.created_at)}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="text-sm font-black text-slate-900">
                          KSh {Number(job.pay_amount_ksh || 0).toLocaleString()}
                          <span className="text-[11px] font-normal text-slate-500"> / {job.pay_period || 'shift'}</span>
                        </span>
                        <span className="rounded-xl bg-orange-50 px-3 py-1 text-xs font-bold text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white transition">
                          Apply
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'trust' && (
            <div className="space-y-5">
              <h3 className="text-base font-black text-slate-900">Verification & Standards</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-slate-600">
                    <strong className="text-slate-900 block mb-0.5">Kenyan Business Legitimacy</strong>
                    Registered hospitality venue operating under Kenyan commercial hospitality laws with approved premises.
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-slate-600">
                    <strong className="text-slate-900 block mb-0.5">Escrow Wage Protection</strong>
                    Shift commitments are financially guaranteed through automated M-Pesa B2C escrow disbursement.
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-slate-600">
                    <strong className="text-slate-900 block mb-0.5">Fair Hospitality Code</strong>
                    Adheres to standard Kenyan work conditions, punctual shift wrap-ups, and transparent review processes.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900">Location & Transit Directions</h3>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">City / County</span>
                  <p className="text-sm font-bold text-slate-800">{establishment.location}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Exact Physical Address</span>
                  <p className="text-sm font-bold text-slate-800">{establishment.address}</p>
                </div>
                <div className="pt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${establishment.name} ${establishment.address} ${establishment.location}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A2540] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#123860]"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-[#FF6B00]" />
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-black text-slate-900">{establishment.name}</p>
            <p className="text-[11px] text-slate-500">{establishment.location}</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('shifts')}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-[#FF6B00] px-5 text-xs font-bold text-white shadow-xs"
          >
            Browse Shifts ({venueJobs.length})
          </button>
        </div>
      </div>
    </section>
  )
}
