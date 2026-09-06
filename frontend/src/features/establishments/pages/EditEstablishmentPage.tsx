import { ArrowLeft, Building2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { endpoints } from '../../../core/api'
import { Button } from '../../../shared/components/ui/Button'
import { FormActions, FormField, FormSection, ValidationErrors } from '../../../shared/components/forms'
import { Modal } from '../../../shared/components/ui/Modal'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Select } from '../../../shared/components/ui/Select'
import { getEstablishment, updateEstablishment } from '../services'
import type { EstablishmentInput } from '../types'

type CatalogOption = { value: string; label: string }
const fallbackBusinessTypes: CatalogOption[] = [{ value: 'hotel', label: 'Hotel' }, { value: 'restaurant', label: 'Restaurant' }, { value: 'cafe', label: 'Cafe / Coffee shop' }, { value: 'other', label: 'Other' }]
const fallbackLocations: CatalogOption[] = [{ value: 'Nairobi', label: 'Nairobi' }]

export function EditEstablishmentPage() {
  const { establishmentId } = useParams()
  const navigate = useNavigate()
  const id = Number(establishmentId)
  const [form, setForm] = useState<EstablishmentInput | null>(null)
  const [businessTypes, setBusinessTypes] = useState(fallbackBusinessTypes)
  const [locations, setLocations] = useState(fallbackLocations)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([getEstablishment(id), endpoints.auth.workerOccupations()]).then(([establishment, catalog]) => {
      if (!active) return
      setForm({ name: establishment.name, establishment_type: establishment.establishment_type, location: establishment.location, address: establishment.address, logo: establishment.logo ?? '' })
      setBusinessTypes(catalog.business_types)
      setLocations(catalog.locations)
    }).catch((reason: Error) => { if (active) setError(reason.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  const update = (key: keyof EstablishmentInput, value: string) => setForm((current) => current ? { ...current, [key]: value } : current)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form) return
    setSaving(true)
    setError('')
    try {
      await updateEstablishment(id, { ...form, logo: form.logo || null })
      navigate(`/establishments/${id}`)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update this establishment.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <section className="mx-auto max-w-5xl px-4 py-12"><p className="text-sm text-slate-500">Loading establishment...</p></section>
  if (!form) return <section className="mx-auto max-w-5xl space-y-4 px-4 py-12"><p className="text-sm text-rose-700">{error || 'Establishment not found.'}</p><Link to={`/establishments/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#0A2540]"><ArrowLeft className="h-4 w-4" />Back to establishment</Link></section>

  return <section className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"><Link to={`/establishments/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#0A2540]"><ArrowLeft className="h-4 w-4" />Back to establishment</Link><PageHeader eyebrow="Employer workspace" title="Manage establishment" description="Keep the venue profile accurate for workers and verification." icon={<Building2 className="h-5 w-5" />} /><Modal isOpen onClose={() => navigate(`/establishments/${id}`)} title="Manage establishment" subtitle="Update venue details and physical location." maxWidth="lg"><form onSubmit={submit} className="space-y-5"><FormSection title="Venue details" description="Update the information workers and the verification team will use." icon={<Building2 className="h-4 w-4" />} divider={false}><div className="grid gap-5 md:grid-cols-2"><FormField label="Establishment name" required><input required value={form.name} onChange={(event) => update('name', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm" /></FormField><FormField label="Type" required><Select searchable required value={form.establishment_type} onChange={(value) => update('establishment_type', value)} options={[{ value: '', label: 'Select establishment type' }, ...businessTypes]} /></FormField><FormField label="City / area" required><Select searchable required value={form.location} onChange={(value) => update('location', value)} options={[{ value: '', label: 'Select city or area' }, ...locations]} /></FormField><FormField label="Logo URL"><input type="url" value={form.logo ?? ''} onChange={(event) => update('logo', event.target.value)} placeholder="https://example.com/logo.png" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm" /></FormField></div><FormField label="Physical location" required helperText="Enter the specific building, estate, street, or landmark manually."><textarea required value={form.address} onChange={(event) => update('address', event.target.value)} rows={3} placeholder="e.g. Nairobi, Kasarani" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm" /></FormField></FormSection><ValidationErrors errors={error ? [error] : null} /><FormActions submitLabel={saving ? 'Saving...' : 'Save changes'} loading={saving} onCancel={() => navigate(`/establishments/${id}`)} /></form></Modal><Button variant="ghost" onClick={() => navigate(`/establishments/${id}`)}>Cancel</Button></section>
}
