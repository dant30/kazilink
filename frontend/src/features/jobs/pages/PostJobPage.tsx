import { ArrowLeft, Briefcase } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../auth/store/authStore'
import { Button } from '../../../shared/components/ui/Button'
import { Modal } from '../../../shared/components/ui/Modal'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { JobForm, type JobFormValues } from '../components'
import { createJob } from '../services'

export function PostJobPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const isEmployer = Boolean(user?.is_employer)
  const [form, setForm] = useState<JobFormValues>({
    title: '',
    category: '',
    location: '',
    job_type: 'full_time',
    pay_amount_ksh: '',
    pay_period: 'per month',
    description: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const update = (key: keyof JobFormValues, value: string) => setForm((current) => ({ ...current, [key]: value }))

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const job = await createJob({ ...form, pay_amount_ksh: Number(form.pay_amount_ksh) })
      navigate(`/jobs/${(job as { id: number }).id}`)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not post this job.')
    } finally {
      setSaving(false)
    }
  }

  if (!isEmployer) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6B00]">Employer only</p>
          <h1 className="mt-4 text-3xl font-black text-slate-900">This feature is for employers.</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Workers should use the application flow to apply for jobs. If you are an employer, sign in with an employer account to post roles.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/jobs" className="inline-flex items-center justify-center rounded-xl bg-[#0A2540] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#123860]">
              Browse jobs
            </Link>
            <Link to="/applications" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
              My applications
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-[#0A2540]">
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>
      <PageHeader eyebrow="Employer workspace" title="Post a new role" description="Share the details applicants need to find and apply for this opportunity." icon={<Briefcase className="h-5 w-5" />} />
      <Modal isOpen onClose={() => navigate('/jobs')} title="Post a new role" subtitle="Create a role for verified hospitality talent." maxWidth="2xl">
        <JobForm values={form} saving={saving} error={error} onChange={update} onSubmit={submit} />
      </Modal>
    </section>
  )
}