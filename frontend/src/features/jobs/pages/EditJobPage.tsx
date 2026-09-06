import { ArrowLeft, Briefcase } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { endpoints } from '../../../core/api'
import { Button } from '../../../shared/components/ui/Button'
import { Modal } from '../../../shared/components/ui/Modal'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { JobForm, type JobFormOptions, type JobFormValues } from '../components'
import { getJob, updateJob } from '../services/jobs'

const fallbackOptions: JobFormOptions = {
  categories: [{ value: 'other', label: 'Other hospitality or domestic role' }],
  locations: [{ value: 'Nairobi', label: 'Nairobi' }],
  jobTypes: [{ value: 'full_time', label: 'Full time' }],
  payPeriods: [{ value: 'per month', label: 'Per month' }],
  skills: [],
}

export function EditJobPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const id = Number(jobId)
  const [form, setForm] = useState<JobFormValues | null>(null)
  const [options, setOptions] = useState<JobFormOptions>(fallbackOptions)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([getJob(id), endpoints.auth.workerOccupations()]).then(([job, catalog]) => {
      if (!active) return
      setForm({
        title: job.title,
        category: job.category,
        location: job.location,
        job_type: job.job_type,
        pay_amount_ksh: String(job.pay_amount_ksh),
        pay_period: job.pay_period,
        shift_times: job.shift_times ?? '',
        requirements: job.requirements?.join('\n') ?? '',
        benefits: job.benefits?.join('\n') ?? '',
        required_skills: job.required_skills ?? [],
        minimum_experience_years: String(job.minimum_experience_years ?? 0),
        description: job.description,
      })
      setOptions({ categories: catalog.occupations, locations: catalog.locations, jobTypes: catalog.job_types, payPeriods: catalog.pay_periods, skills: catalog.skills })
    }).catch((reason: Error) => { if (active) setError(reason.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  const update = (key: keyof JobFormValues, value: string | string[]) => setForm((current) => current ? { ...current, [key]: value } : current)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form) return
    setSaving(true)
    setError('')
    try {
      await updateJob(id, {
        ...form,
        pay_amount_ksh: Number(form.pay_amount_ksh),
        requirements: form.requirements.split('\n').map((item) => item.trim()).filter(Boolean),
        benefits: form.benefits.split('\n').map((item) => item.trim()).filter(Boolean),
      })
      navigate(`/jobs/${id}`)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update this role.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <section className="mx-auto max-w-5xl px-4 py-12"><p className="text-sm text-slate-500">Loading role...</p></section>
  if (!form) return <section className="mx-auto max-w-5xl space-y-4 px-4 py-12"><p className="text-sm text-rose-700">{error || 'Role not found.'}</p><Link to={`/jobs/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#0A2540]"><ArrowLeft className="h-4 w-4" />Back to role</Link></section>

  return <section className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"><Link to={`/jobs/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#0A2540]"><ArrowLeft className="h-4 w-4" />Back to role</Link><PageHeader eyebrow="Employer workspace" title="Manage role" description="Update the details applicants see for this role." icon={<Briefcase className="h-5 w-5" />} /><Modal isOpen onClose={() => navigate(`/jobs/${id}`)} title="Manage role" subtitle="Update the role details and applicant expectations." maxWidth="2xl"><JobForm values={form} options={options} saving={saving} error={error} onChange={update} onSubmit={submit} submitLabel="Save changes" /></Modal><Button variant="ghost" onClick={() => navigate(`/jobs/${id}`)}>Cancel</Button></section>
}
