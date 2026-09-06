import { ArrowLeft, Bookmark, Briefcase, Check, CheckCircle2, Clock3, MapPin, Share2, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useAuthStore } from '../../auth/store/authStore'
import { Button } from '../../../shared/components/ui/Button'
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { Badge } from '../../../shared/components/ui/Badge'
import { useJob } from '../hooks'
import { applyForJob } from '../services'
import { endpoints } from '../../../core/api'
import { formatRelativeTime } from '../../../core/utils'

export function JobDetailPage() {
  const { user } = useAuthStore()
  const isEmployer = Boolean(user?.is_employer)
  const isWorker = Boolean(user?.is_worker)
  const { jobId } = useParams()
  const { job, loading, error } = useJob(Number(jobId))
  const [applying, setApplying] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackError, setFeedbackError] = useState(false)
  const [creditBalance, setCreditBalance] = useState<number | null>(null)
  const [confirmApplication, setConfirmApplication] = useState(false)
  const [premiumAction, setPremiumAction] = useState<'feature' | 'boost' | null>(null)
  const [premiumActionLoading, setPremiumActionLoading] = useState(false)
  const [premiumActionFeedback, setPremiumActionFeedback] = useState('')
  const [premiumActionError, setPremiumActionError] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    if (!user || (!isWorker && !isEmployer)) return
    endpoints.credits.wallet().then((response) => setCreditBalance(response.wallet.balance)).catch(() => setCreditBalance(null))
  }, [isEmployer, isWorker, user])

  useEffect(() => {
    if (!isWorker || !jobId) return
    endpoints.jobs.saveStatus(Number(jobId)).then((response) => setSaved(response.saved)).catch(() => setSaved(false))
  }, [isWorker, jobId])

  const toggleSaved = async () => {
    if (!job) return
    setSaving(true)
    try {
      const response = saved ? await endpoints.jobs.unsave(job.id) : await endpoints.jobs.save(job.id)
      setSaved(response.saved)
    } catch (reason) {
      setFeedback(reason instanceof Error ? reason.message : 'Unable to update saved jobs.')
      setFeedbackError(true)
    } finally {
      setSaving(false)
    }
  }

  const shareJob = async () => {
    if (!job) return
    const shareData = { title: job.title, text: `${job.title} in ${job.location} on KaziLink`, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(shareData)
      else { await navigator.clipboard.writeText(window.location.href); setShared(true); window.setTimeout(() => setShared(false), 2000) }
    } catch {}
  }

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
  const benefits = job.benefits ?? []
  const premiumActionCost = premiumAction === 'feature' ? 3 : 5
  const runPremiumAction = async () => {
    if (!premiumAction) return
    setPremiumActionLoading(true)
    setPremiumActionFeedback('')
    setPremiumActionError(false)
    try {
      const key = `${premiumAction}:${job.id}:${Date.now()}`
      if (premiumAction === 'feature') {
        await endpoints.jobs.featureWithCredits(job.id, key)
      } else {
        await endpoints.jobs.boostWithCredits(job.id, key)
      }
      const response = await endpoints.credits.wallet()
      setCreditBalance(response.wallet.balance)
      setPremiumActionFeedback(premiumAction === 'feature' ? 'Job featured for 24 hours.' : 'Job boosted for 7 days.')
      setPremiumAction(null)
    } catch (reason) {
      setPremiumActionError(true)
      setPremiumActionFeedback(reason instanceof Error ? reason.message : 'The action failed. Your credits were not charged.')
    } finally {
      setPremiumActionLoading(false)
    }
  }

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
              <Badge variant="neutral" size="sm" className="border-white/15 bg-white/10 text-slate-200">{job.category || 'Hospitality'}</Badge>
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
          {isWorker && <div className="mt-5 flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => void toggleSaved()} disabled={saving} leftIcon={saved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}>{saved ? 'Saved' : 'Save job'}</Button><Button variant="outline" size="sm" onClick={() => void shareJob()} leftIcon={<Share2 className="h-4 w-4" />}>{shared ? 'Link copied' : 'Share job'}</Button></div>}
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
              <h2 className="text-lg font-black text-slate-900">Skills and experience</h2>
              <p className="mt-3 text-sm text-slate-600">Minimum experience: <strong className="text-slate-900">{job.minimum_experience_years || 0} years</strong></p>
              {job.required_skills?.length ? <div className="mt-4 flex flex-wrap gap-2">{job.required_skills.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{skill.replace(/_/g, ' ')}</span>)}</div> : <p className="mt-3 text-sm text-slate-500">No structured skills were specified.</p>}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-black text-slate-900">Extra benefits</h2>
              {benefits.length ? <ul className="mt-4 space-y-3">
                {benefits.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0A2540]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul> : <p className="mt-3 text-sm text-slate-500">No extra benefits listed for this role.</p>}
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
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs text-slate-600">
                    <div className="flex items-center justify-between"><span>Credit balance</span><strong className="text-[#0A2540]">{creditBalance ?? '...'} Kazi Credits</strong></div>
                    {creditBalance === 0 && <p className="mt-2 text-amber-700">You need credits for premium job visibility. <Link to="/payments" className="font-bold underline">Buy Kazi Credits</Link></p>}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" disabled={creditBalance === 0 || premiumActionLoading} onClick={() => setPremiumAction('feature')}>Feature · 3</Button>
                    <Button variant="outline" size="sm" disabled={creditBalance === 0 || premiumActionLoading} onClick={() => setPremiumAction('boost')}>Boost · 5</Button>
                  </div>
                  <Link
                    to={`/jobs/${job.id}/edit`}
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
                  {premiumActionFeedback && <p className={`rounded-xl border px-3 py-2 text-xs font-medium ${premiumActionError ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{premiumActionFeedback}</p>}
                </div>
              ) : user && isWorker ? (
                <>
                <p className="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">Cost: <strong className="text-[#0A2540]">1 Kazi Credit</strong> per successful application. Balance: <strong className="text-[#0A2540]">{creditBalance ?? '...'}</strong></p>
                {creditBalance === 0 && (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs font-medium text-amber-800">
                    You need 1 Kazi Credit to apply. <Link to="/payments" className="font-bold underline">Buy Kazi Credits</Link>
                  </div>
                )}
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-4 w-full justify-center"
                  disabled={applying || !isWorker || creditBalance === 0}
                  onClick={() => setConfirmApplication(true)}
                >
                  Apply now
                </Button>
                </>
              ) : user ? (
                <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">Only worker accounts can apply for jobs.</p>
              ) : (
                <Link
                  to="/login"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E55F00]"
                >
                  Sign in to apply
                </Link>
              )}

              {feedback && (
                <p className={`mt-3 rounded-xl border px-3 py-2 text-xs font-medium ${feedbackError ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
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
                  <span className="font-semibold text-slate-900">{formatRelativeTime(job.posted_date)}</span>
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
      <ConfirmDialog
        isOpen={confirmApplication}
        title="Confirm job application"
        message={<span>This successful application will use <strong>1 Kazi Credit</strong>. Your balance is <strong>{creditBalance ?? '...'}</strong>. Credits are restored if the application cannot be completed.</span>}
        confirmLabel="Use 1 Credit"
        loading={applying}
        onCancel={() => setConfirmApplication(false)}
        onConfirm={async () => {
          setApplying(true)
          setFeedback('')
          setFeedbackError(false)
          try {
            await applyForJob(job.id)
            const response = await endpoints.credits.wallet()
            setCreditBalance(response.wallet.balance)
            setFeedback('Application submitted successfully. 1 Kazi Credit used.')
            setConfirmApplication(false)
          } catch (reason) {
            setFeedbackError(true)
            setFeedback(reason instanceof Error ? reason.message : 'Could not submit application. Your credits were not charged.')
          } finally {
            setApplying(false)
          }
        }}
      />
      <ConfirmDialog
        isOpen={Boolean(premiumAction)}
        title={premiumAction === 'feature' ? 'Feature this job?' : 'Boost this job?'}
        message={<span>This will use <strong>{premiumActionCost} Kazi Credits</strong>. {premiumAction === 'feature' ? 'Your job will be featured for 24 hours.' : 'Your job will receive a boost for 7 days.'} Your balance is <strong>{creditBalance ?? '...'}</strong>.</span>}
        confirmLabel={`Use ${premiumActionCost} Credits`}
        loading={premiumActionLoading}
        onCancel={() => setPremiumAction(null)}
        onConfirm={runPremiumAction}
      />
    </section>
  )
}

