import { ArrowLeft, Briefcase, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../auth/store/authStore'
import { Button } from '../../../shared/components/ui/Button'
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
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-[#0A2540]">
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#0A2540] via-[#123860] to-[#0E2E4E] p-6 text-white sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#FF6B00] p-2 text-white">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Employer workspace</p>
              <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">Post a new role</h1>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
            <Sparkles className="h-4 w-4" />
            Role details
          </div>

          <JobForm values={form} saving={saving} error={error} onChange={update} onSubmit={submit} />

          <div className="mt-6 flex justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/jobs')}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}