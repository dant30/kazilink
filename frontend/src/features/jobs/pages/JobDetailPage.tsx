import { ArrowLeft, Briefcase, CheckCircle2, Clock3, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useAuthStore } from '../../auth/store/authStore'
import { Button } from '../../../shared/components/ui/Button'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { useJob } from '../hooks'
import { applyForJob } from '../services'

export function JobDetailPage() {
  const { user } = useAuthStore()
  const isEmployer = Boolean(user?.is_employer)
  const isWorker = Boolean(user?.is_worker)
  const { jobId } = useParams()
  const { job, loading, error } = useJob(Number(jobId))
  const [applying, setApplying] = useState(false)
  const [feedback, setFeedback] = useState('')

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-96 w-full rounded-2xl" aria-label="Loading job details" />
      </section>
    )
  }

  if (error || !job) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-rose-700">{error || 'Job not found.'}</p>
          <Link to="/jobs" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0A2540]">
            <ArrowLeft className="h-4 w-4" />
            Back to jobs
          </Link>
        </div>
      </section>
    )
  }

  const roleType = job.job_type?.replace(/_/g, ' ') || 'shift'
  const requirements = job.requirements?.length ? job.requirements : ['Previous hospitality experience preferred.', 'Reliable and punctual attendance.', 'Strong customer service and teamwork.']
  const benefits = job.benefits?.length ? job.benefits : ['Daily or weekly pay options', 'Supportive staff environment', 'Client referral opportunities']

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-[#0A2540]">
        <ArrowLeft className="h-4 w-4" />
        All jobs
      </Link>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#0A2540] via-[#123860] to-[#0E2E4E] p-6 text-white sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">
                {job.category || 'Hospitality'}
              </span>
              <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">{job.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-200">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#FF6B00]" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#FF6B00]" />
                  {roleType}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-[#FF6B00]" />
                  {job.status || 'Open now'}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">Compensation</p>
              <p className="mt-2 text-3xl font-black text-white">
                KSh {job.pay_amount_ksh?.toLocaleString() ?? '0'}
              </p>
              <p className="text-sm text-slate-200">{job.pay_period || 'per shift'}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.5fr_0.8fr] lg:p-8">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#0A2540]">
                <Sparkles className="h-4 w-4 text-[#FF6B00]" />
                Job overview
              </div>
              <p className="text-sm leading-7 text-slate-600">{job.description}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-black text-slate-900">Requirements</h2>
              <ul className="mt-4 space-y-3">
                {requirements.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B00]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-black text-slate-900">What you get</h2>
              <ul className="mt-4 space-y-3">
                {benefits.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0A2540]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {isEmployer ? 'Hiring' : isWorker ? 'Application' : 'Preview'}
                </p>
                {job.is_urgent && <span className="rounded-full bg-[#FFF1F2] px-2 py-1 text-[10px] font-bold text-[#BE123C]">Urgent</span>}
              </div>

              {isEmployer ? (
                <div className="mt-4 space-y-3">
                  <Link
                    to="/jobs/new"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#123860]"
                  >
                    <Briefcase className="h-4 w-4" />
                    Manage this role
                  </Link>
                  <Link
                    to="/applications"
                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    View applicants
                  </Link>
                </div>
              ) : user ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-4 w-full justify-center"
                  disabled={applying}
                  onClick={async () => {
                    setApplying(true)
                    setFeedback('')
                    try {
                      await applyForJob(job.id)
                      setFeedback('Application submitted successfully.')
                    } catch (reason) {
                      setFeedback(reason instanceof Error ? reason.message : 'Could not submit application.')
                    } finally {
                      setApplying(false)
                    }
                  }}
                >
                  {applying ? 'Applying...' : 'Apply now'}
                </Button>
              ) : (
                <Link
                  to="/login"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E55F00]"
                >
                  Sign in to apply
                </Link>
              )}

              {feedback && (
                <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                  {feedback}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">{isEmployer ? 'Role summary' : 'Employer summary'}</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between gap-3">
                  <span>Location</span>
                  <span className="font-semibold text-slate-900">{job.location}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Type</span>
                  <span className="font-semibold text-slate-900">{roleType}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Posted</span>
                  <span className="font-semibold text-slate-900">{job.posted_date || 'Recently'}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Applicants</span>
                  <span className="font-semibold text-slate-900">{job.applicant_count ?? 0}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}