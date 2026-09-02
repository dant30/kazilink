import { ArrowRight, Building2, CheckCircle2, Clock3, FileText, PlusCircle, ShieldCheck, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { endpoints } from '../../../core/api'
import { useAuthStore } from '../../auth/store/authStore'
import { useEstablishments } from '../../establishments/hooks'
import { useEmploymentHistory } from '../hooks'
import { createEmploymentRecord } from '../services'
import type { EmploymentRecordInput } from '../types'
import { DatePicker } from '../../../shared/components/ui/DatePicker'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { StatCard } from '../../../shared/components/cards/StatCard'

const defaultForm: EmploymentRecordInput = {
  worker_id: undefined,
  establishment_id: undefined,
  establishment_name: '',
  establishment_type: '',
  location: '',
  position: '',
  start_date: '',
  end_date: '',
  is_current: true,
  responsibilities: [],
  reference_contact_name: '',
  reference_contact_phone: '',
  reference_role: '',
}

export function EmploymentHistoryPage() {
  const { user } = useAuthStore()
  const { records, loading, error, refetch } = useEmploymentHistory()
  const { establishments, loading: establishmentsLoading } = useEstablishments()
  const [workers, setWorkers] = useState<Array<{ id: number; full_name: string; phone: string; is_worker: boolean }>>([])
  const [form, setForm] = useState<EmploymentRecordInput>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!user?.is_employer) return

    let active = true
    endpoints.auth.adminUsers()
      .then((data) => {
        if (!active) return
        const allUsers = Array.isArray(data) ? data : data.results ?? []
        setWorkers(allUsers.filter((candidate) => candidate.is_worker))
      })
      .catch(() => {
        if (!active) return
        setWorkers([])
      })

    return () => {
      active = false
    }
  }, [user?.is_employer])

  const selectedEstablishment = useMemo(
    () => establishments.find((item) => form.establishment_id !== undefined && item.id === form.establishment_id) ?? null,
    [establishments, form.establishment_id],
  )

  useEffect(() => {
    if (!selectedEstablishment) return
    setForm((current) => ({
      ...current,
      establishment_name: current.establishment_name || selectedEstablishment.name,
      establishment_type: current.establishment_type || selectedEstablishment.establishment_type,
      location: current.location || selectedEstablishment.location,
    }))
  }, [selectedEstablishment])

  const summary = useMemo(() => ({
    total: records.length,
    verified: records.filter((record) => record.verification_status === 'verified').length,
    pending: records.filter((record) => record.verification_status === 'pending').length,
    rejected: records.filter((record) => record.verification_status === 'rejected').length,
  }), [records])

  const handleChange = (key: keyof EmploymentRecordInput, value: string | number | boolean | string[] | undefined | null) => {
    setForm((current) => ({ ...current, [key]: value }))
    setFormError('')
    setSuccessMessage('')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user?.is_employer) return

    setSaving(true)
    setFormError('')
    setSuccessMessage('')

    try {
      const payload: EmploymentRecordInput = {
        ...form,
        worker_id: Number(form.worker_id),
        establishment_id: Number(form.establishment_id),
        establishment_name: form.establishment_name || selectedEstablishment?.name || '',
        establishment_type: form.establishment_type || selectedEstablishment?.establishment_type || '',
        location: form.location || selectedEstablishment?.location || '',
        end_date: form.is_current ? null : form.end_date || null,
        responsibilities: form.responsibilities ?? [],
      }

      await createEmploymentRecord(payload)
      setSuccessMessage('Employment record added and sent for verification.')
      setForm(defaultForm)
      await refetch()
    } catch (reason) {
      setFormError((reason as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Employment history" title={user?.is_worker ? 'Your work passport' : user?.is_employer ? 'Employment verification desk' : 'History verification desk'} actions={<div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200"><ShieldCheck className="h-4 w-4 text-[#FF6B00]" />{summary.total} records</div>} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total" value={summary.total} subtitle="Recorded employment entries" icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Verified" value={summary.verified} subtitle="Approved records" icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" />
        <StatCard title="Pending" value={summary.pending} subtitle="Awaiting review" icon={<Clock3 className="h-5 w-5" />} iconBg="bg-amber-50 text-amber-600" />
        <StatCard title="Rejected" value={summary.rejected} subtitle="Need attention" icon={<ShieldCheck className="h-5 w-5" />} iconBg="bg-rose-50 text-rose-600" />
      </div>

      {user?.is_employer && (
        <div className="card-kazilink p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Add a worker record</h2>
              <p className="text-xs text-slate-500">Attach verified history to one of your establishments for review.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF2E8] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
              <PlusCircle className="h-3.5 w-3.5" />
              Employer action
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Worker</span>
                <select
                  required
                  value={form.worker_id ?? ''}
                  onChange={(event) => handleChange('worker_id', Number(event.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-[#FF6B00] focus:bg-white"
                >
                  <option value="">Select worker</option>
                  {workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>{worker.full_name} · {worker.phone}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Establishment</span>
                <select
                  required
                  value={form.establishment_id ?? ''}
                  onChange={(event) => handleChange('establishment_id', Number(event.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-[#FF6B00] focus:bg-white"
                  disabled={establishmentsLoading}
                >
                  <option value="">Select establishment</option>
                  {establishments.map((establishment) => (
                    <option key={establishment.id} value={establishment.id}>{establishment.name}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Position</span>
                <input
                  required
                  value={form.position}
                  onChange={(event) => handleChange('position', event.target.value)}
                  placeholder="Supervisor, Cook, Waiter"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Reference role</span>
                <input
                  value={form.reference_role}
                  onChange={(event) => handleChange('reference_role', event.target.value)}
                  placeholder="Manager / Head chef"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                />
              </label>

              <DatePicker label="Start date" required value={form.start_date} onChange={(value) => handleChange('start_date', value)} maxDate={form.end_date || undefined} />
              <DatePicker label="End date" value={form.end_date ?? ''} onChange={(value) => handleChange('end_date', value)} minDate={form.start_date || undefined} disabled={Boolean(form.is_current)} />
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-700">
              <input
                id="is_current"
                type="checkbox"
                checked={Boolean(form.is_current)}
                onChange={(event) => {
                  const checked = event.target.checked
                  handleChange('is_current', checked)
                  if (checked) handleChange('end_date', null)
                }}
                className="h-4 w-4 rounded border-slate-300 text-[#FF6B00] focus:ring-[#FFB380]"
              />
              <label htmlFor="is_current">This is their current role</label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Reference contact name</span>
                <input
                  required
                  value={form.reference_contact_name}
                  onChange={(event) => handleChange('reference_contact_name', event.target.value)}
                  placeholder="Jane Wambui"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Reference phone</span>
                <input
                  required
                  value={form.reference_contact_phone}
                  onChange={(event) => handleChange('reference_contact_phone', event.target.value)}
                  placeholder="07xx xxx xxx"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                />
              </label>
            </div>

            {formError && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>}
            {successMessage && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-xl bg-[#FF6B00] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#E55F00] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Add employment record'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card-kazilink p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Work history</h2>
            <p className="text-xs text-slate-500">Track prior roles and verification status.</p>
          </div>
        </div>

        {loading && <p className="mt-6 text-sm text-slate-500">Loading employment history...</p>}
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {!loading && !error && records.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
            No employment history found yet.
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="mt-6 space-y-4">
            {records.map((record) => (
              <article key={record.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{record.establishment_type || 'Hospitality'}</p>
                    <h3 className="mt-2 text-lg font-black text-slate-900">{record.establishment_name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{record.position}</p>
                  </div>
                  <StatusBadge status={record.verification_status} />
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-[#FF6B00]" /> {record.worker_name || 'Worker'}</div>
                  <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-[#FF6B00]" /> {record.location}</div>
                  <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#FF6B00]" /> {record.start_date} {record.end_date ? `– ${record.end_date}` : ''}</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#FF6B00]" /> {record.is_current ? 'Current role' : 'Previous role'}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function StatusBadge({ status }: { status: 'pending' | 'verified' | 'rejected' | string }) {
  const palette = {
    pending: 'bg-amber-100 text-amber-700',
    verified: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-rose-100 text-rose-700',
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${palette[status as keyof typeof palette] ?? 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  )
}
