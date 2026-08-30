import { ArrowLeft, Briefcase, CalendarClock, CheckCircle2, Clock3, FileText, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useAuthStore } from '../../auth/store/authStore'
import { Button } from '../../../shared/components/ui/Button'
import { ApplicationStatusBadge } from '../components'
import { useApplication } from '../hooks'
import { updateApplicationStatus } from '../services'
import type { ApplicationStatusInput, JobApplicationStatus } from '../types'

const statusOptions: JobApplicationStatus[] = ['applied', 'shortlisted', 'interview_scheduled', 'hired', 'rejected']

export function ApplicationDetailPage() {
  const { user } = useAuthStore()
  const { applicationId } = useParams()
  const { application, loading, error } = useApplication(Number(applicationId))
  const app = application as NonNullable<typeof application>
  const [draftStatus, setDraftStatus] = useState<JobApplicationStatus>('applied')
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewNote, setInterviewNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (app) {
      setDraftStatus(app.status)
      setInterviewDate(app.interview_date ?? '')
      setInterviewNote(app.interview_note ?? '')
    }
  }, [app])

  const canReview = Boolean(user?.is_employer && !user?.is_worker)

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          Loading application details...
        </div>
      </section>
    )
  }

  if (error || !app) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-rose-700">{error || 'Application not found.'}</p>
          <Link to="/applications" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0A2540]">
            <ArrowLeft className="h-4 w-4" />
            Back to applications
          </Link>
        </div>
      </section>
    )
  }

  async function handleStatusUpdate() {
    const payload: ApplicationStatusInput = {
      status: draftStatus,
      interview_date: draftStatus === 'interview_scheduled' ? interviewDate || null : null,
      interview_note: interviewNote || '',
    }

    setSaving(true)
    setMessage('')

    try {
      await updateApplicationStatus(app.id, payload)
      setMessage('Status updated successfully.')
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Unable to update status.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/applications" className="inline-flex items-center gap-2 text-sm font-bold text-[#0A2540]">
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </Link>

      <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Application overview</p>
            <h1 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">{app.job_title || 'Role application'}</h1>
          </div>
          <ApplicationStatusBadge status={app.status} />
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.35fr_0.9fr] lg:p-8">
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-black text-slate-900">Candidate details</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-[#FF6B00]" />
                  <span>{app.worker_name || 'Worker'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-[#FF6B00]" />
                  <span>{app.employer_name || 'Employer'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-4 w-4 text-[#FF6B00]" />
                  <span>{new Date(app.applied_date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-black text-slate-900">Cover note</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {app.cover_note || 'No cover note was provided for this application.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-black text-slate-900">Interview notes</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {app.interview_note || 'No interview notes have been added yet.'}
              </p>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                <FileText className="h-4 w-4 text-[#0A2540]" />
                Timeline
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-3">
                  <span>Applied</span>
                  <span className="font-semibold text-slate-900">{new Date(app.applied_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Reviewed</span>
                  <span className="font-semibold text-slate-900">{app.reviewed_by_employer ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Interview</span>
                  <span className="font-semibold text-slate-900">{app.interview_date ? new Date(app.interview_date).toLocaleDateString() : 'Not set'}</span>
                </div>
              </div>
            </div>

            {canReview && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Update decision</h3>
                <div className="mt-4 space-y-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Status
                    <select
                      value={draftStatus}
                      onChange={(event) => setDraftStatus(event.target.value as JobApplicationStatus)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00]"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </label>

                  {draftStatus === 'interview_scheduled' && (
                    <label className="block text-sm font-medium text-slate-700">
                      Interview date
                      <input
                        type="datetime-local"
                        value={interviewDate}
                        onChange={(event) => setInterviewDate(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00]"
                      />
                    </label>
                  )}

                  <label className="block text-sm font-medium text-slate-700">
                    Interview note
                    <textarea
                      value={interviewNote}
                      onChange={(event) => setInterviewNote(event.target.value)}
                      rows={4}
                      placeholder="Add interview context, expectations, or next steps."
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00]"
                    />
                  </label>

                  <Button variant="primary" size="md" className="w-full justify-center" onClick={handleStatusUpdate} isLoading={saving}>
                    Save decision
                  </Button>

                  {message && (
                    <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                      {message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!canReview && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <Clock3 className="h-4 w-4 text-[#FF6B00]" />
                  <span>Waiting for employer review.</span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>We will notify you once your application progresses.</span>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
