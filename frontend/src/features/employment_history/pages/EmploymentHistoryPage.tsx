import { ArrowRight, Building2, CheckCircle2, Clock3, FileText, PlusCircle, ShieldCheck, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { endpoints } from '../../../core/api'
import { useAuthStore } from '../../auth/store/authStore'
import { useEstablishments } from '../../establishments/hooks'
import { useEmploymentHistory } from '../hooks'
import { createEmploymentRecord } from '../services'
import { revokeHistoryAccess } from '../services'
import type { EmploymentRecord, EmploymentRecordInput } from '../types'
import { DatePicker } from '../../../shared/components/ui/DatePicker'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { StatCard } from '../../../shared/components/cards/StatCard'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { EmptyState } from '../../../shared/components/feedback'
import { Select } from '../../../shared/components/ui/Select'
import { Button } from '../../../shared/components/ui/Button'
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog'
import { Modal } from '../../../shared/components/ui/Modal'

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

type EmploymentHistoryPageRecord = EmploymentRecord

export function EmploymentHistoryPage() {
  const { user } = useAuthStore()
  const { records, loading, error, refetch } = useEmploymentHistory()
  const { establishments, loading: establishmentsLoading } = useEstablishments()
  const [workers, setWorkers] = useState<Array<{ id: number; full_name: string; phone: string; is_worker: boolean }>>([])
  const [form, setForm] = useState<EmploymentRecordInput>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [revokingAccess, setRevokingAccess] = useState(false)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [addEmploymentModalOpen, setAddEmploymentModalOpen] = useState(false)

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

  const groupedRecords = useMemo(() => ({
    verified: records.filter((record) => record.verification_status === 'verified'),
    pending: records.filter((record) => record.verification_status === 'pending'),
    rejected: records.filter((record) => record.verification_status === 'rejected'),
  }), [records])

  const handleRevokeAccess = async () => {
    setRevokingAccess(true)
    setFormError('')
    setSuccessMessage('')
    try {
      const response = await revokeHistoryAccess()
      setSuccessMessage(`${response.revoked_count} active history access record${response.revoked_count === 1 ? '' : 's'} revoked.`)
      setRevokeDialogOpen(false)
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : 'Unable to revoke history access.')
    } finally {
      setRevokingAccess(false)
    }
  }

  const handleChange = (key: keyof EmploymentRecordInput, value: string | number | boolean | string[] | undefined | null) => {
    setForm((current) => ({ ...current, [key]: value }))
    setFormError('')
    setSuccessMessage('')
  }

  const openAddEmploymentModal = () => {
    setForm(defaultForm)
    setFormError('')
    setSuccessMessage('')
    setAddEmploymentModalOpen(true)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return

    setSaving(true)
    setFormError('')
    setSuccessMessage('')

    try {
      const payload: EmploymentRecordInput = user.is_employer ? {
        ...form,
        worker_id: Number(form.worker_id),
        establishment_id: Number(form.establishment_id),
        establishment_name: form.establishment_name || selectedEstablishment?.name || '',
        establishment_type: form.establishment_type || selectedEstablishment?.establishment_type || '',
        location: form.location || selectedEstablishment?.location || '',
        end_date: form.is_current ? null : form.end_date || null,
        responsibilities: form.responsibilities ?? [],
      } : {
        ...form,
        establishment_name: form.establishment_name.trim(),
        establishment_type: form.establishment_type?.trim() || '',
        location: form.location?.trim() || '',
        end_date: form.is_current ? null : form.end_date || null,
        responsibilities: form.responsibilities ?? [],
        worker_id: undefined,
        establishment_id: undefined,
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

  const renderEmploymentDates = () => <>
    <DatePicker label="Start date" required value={form.start_date} onChange={(value) => handleChange('start_date', value)} maxDate={form.end_date || undefined} />
    <DatePicker label="End date" value={form.end_date ?? ''} onChange={(value) => handleChange('end_date', value)} minDate={form.start_date || undefined} disabled={Boolean(form.is_current)} />
  </>

  const renderReferenceFields = () => <div className="grid gap-5 md:grid-cols-2">
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>Reference contact name</span>
      <input required value={form.reference_contact_name} onChange={(event) => handleChange('reference_contact_name', event.target.value)} placeholder="Jane Wambui" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none" />
    </label>
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>Reference phone</span>
      <input required value={form.reference_contact_phone} onChange={(event) => handleChange('reference_contact_phone', event.target.value)} placeholder="07xx xxx xxx" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none" />
    </label>
  </div>

  const renderCurrentRoleToggle = (id: string) => <div className="flex items-center gap-2 text-sm text-slate-700">
    <input id={id} type="checkbox" checked={Boolean(form.is_current)} onChange={(event) => { const checked = event.target.checked; handleChange('is_current', checked); if (checked) handleChange('end_date', null) }} className="h-4 w-4 rounded border-slate-300 text-[#FF6B00] focus:ring-[#FFB380]" />
    <label htmlFor={id}>This is their current role</label>
  </div>

  const renderRecord = (record: EmploymentHistoryPageRecord) => (
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
        <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#FF6B00]" /> {record.start_date} {record.end_date ? `- ${record.end_date}` : ''}</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#FF6B00]" /> {record.is_current ? 'Current role' : 'Previous role'}</div>
      </div>
      <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
        <span>Reference: {record.reference_verification_status || 'pending'} ({record.reference_verification_attempts || 0} attempts)</span>
        {record.verification_notes && <span>Review notes: {record.verification_notes}</span>}
      </div>
    </article>
  )

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Employment history" title={user?.is_worker ? 'Your work passport' : user?.is_employer ? 'Employment verification desk' : 'History verification desk'} actions={user?.is_worker ? <div className="flex flex-nowrap items-center gap-2"><Button variant="primary" size="sm" leftIcon={<PlusCircle className="h-4 w-4" />} onClick={openAddEmploymentModal}>Add previous employment</Button><Button variant="outline" size="sm" onClick={() => setRevokeDialogOpen(true)} disabled={revokingAccess}>Revoke future access</Button></div> : undefined} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard title="Total" value={summary.total} subtitle="Recorded employment entries" icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Verified" value={summary.verified} subtitle="Approved records" icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" />
        <StatCard title="Pending" value={summary.pending} subtitle="Awaiting review" icon={<Clock3 className="h-5 w-5" />} iconBg="bg-amber-50 text-amber-600" />
        <StatCard title="Rejected" value={summary.rejected} subtitle="Need attention" icon={<ShieldCheck className="h-5 w-5" />} iconBg="bg-rose-50 text-rose-600" />
      </div>

      {user?.is_worker && (
        <Modal isOpen={addEmploymentModalOpen} onClose={() => setAddEmploymentModalOpen(false)} title="Add previous employment" subtitle="Tell us where you worked. A reference and the KaziLink verification team will review it before it appears as verified." maxWidth="2xl">
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">Worker submission</p>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Establishment name</span>
                <input required value={form.establishment_name} onChange={(event) => handleChange('establishment_name', event.target.value)} placeholder="Sunrise Hotel" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none" />
              </label>
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Establishment type</span>
                <input value={form.establishment_type} onChange={(event) => handleChange('establishment_type', event.target.value)} placeholder="Hotel, restaurant, shop" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none" />
              </label>
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Location</span>
                <input value={form.location} onChange={(event) => handleChange('location', event.target.value)} placeholder="Nairobi, Kenya" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none" />
              </label>
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Position</span>
                <input required value={form.position} onChange={(event) => handleChange('position', event.target.value)} placeholder="Cook, waiter, driver" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none" />
              </label>
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Reference role</span>
                <input value={form.reference_role} onChange={(event) => handleChange('reference_role', event.target.value)} placeholder="Manager / Head chef" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none" />
              </label>
              {renderEmploymentDates()}
            </div>
            {renderCurrentRoleToggle('worker_is_current')}
            {renderReferenceFields()}
            {formError && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>}
            {successMessage && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>}
            <div className="flex justify-end"><button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-xl bg-[#FF6B00] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#E55F00] disabled:cursor-not-allowed disabled:opacity-70">{saving ? 'Submitting...' : 'Submit for verification'}</button></div>
          </form>
        </Modal>
      )}

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
              <Select label="Worker" required value={String(form.worker_id ?? '')} onChange={(value) => handleChange('worker_id', Number(value))} options={[{ value: '', label: 'Select worker' }, ...workers.map((worker) => ({ value: String(worker.id), label: worker.full_name, sublabel: worker.phone }))]} />

              <Select label="Establishment" required value={String(form.establishment_id ?? '')} onChange={(value) => handleChange('establishment_id', Number(value))} options={[{ value: '', label: 'Select establishment' }, ...establishments.map((establishment) => ({ value: String(establishment.id), label: establishment.name }))]} disabled={establishmentsLoading} />

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

        {loading && <div className="mt-6 space-y-4" aria-label="Loading employment history" aria-busy="true"><Skeleton className="h-36 rounded-2xl" /><Skeleton className="h-36 rounded-2xl" /><Skeleton className="h-36 rounded-2xl" /></div>}
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {!loading && !error && records.length === 0 && (
          <EmptyState title="No employment history found yet" description="Verified work history will appear here." icon={<FileText className="h-8 w-8" />} size="md" className="mt-6" />
        )}

        {!loading && !error && records.length > 0 && (
          <div className="mt-6 space-y-6">
            {(['verified', 'pending', 'rejected'] as const).map((status) => {
              const items = groupedRecords[status]
              if (!items.length) return null
              return <section key={status} className="space-y-3"><div className="flex items-center gap-2"><StatusBadge status={status} /><h3 className="text-sm font-black capitalize text-slate-900">{status} records</h3><span className="text-xs text-slate-400">({items.length})</span></div>{items.map(renderRecord)}</section>
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={revokeDialogOpen}
        title="Revoke future history access?"
        message="Employers will no longer be able to access your employment history. Previously granted access will remain preserved in the audit history."
        confirmLabel="Revoke access"
        cancelLabel="Keep access"
        variant="warning"
        loading={revokingAccess}
        onConfirm={() => void handleRevokeAccess()}
        onCancel={() => setRevokeDialogOpen(false)}
      />
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
