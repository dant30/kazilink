import { ArrowRight, Building2, CheckCircle2, MapPin, Search, ShieldCheck, Sparkles, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuthStore } from '../../auth/store/authStore'
import { Select } from '../../../shared/components/ui/Select'
import { ErrorBoundary } from '../../../shared/components/ui/ErrorBoundary'
import { useEstablishments } from '../hooks'
import { createEstablishment } from '../services'
import type { EstablishmentFilters, EstablishmentInput } from '../types'
import { StatCard } from '../../../shared/components/cards/StatCard'
import { FormActions, FormField, FormSection, ValidationErrors } from '../../../shared/components/forms'
import { Button } from '../../../shared/components/ui/Button'
import { Modal } from '../../../shared/components/ui/Modal'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { EmptyState } from '../../../shared/components/feedback'
import { endpoints } from '../../../core/api'
import { EstablishmentCard } from '../components/EstablishmentCard'

type CatalogOption = { value: string; label: string }

const fallbackBusinessTypes: CatalogOption[] = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Cafe / Coffee shop' },
  { value: 'other', label: 'Other' },
]

const fallbackLocations: CatalogOption[] = [{ value: 'Nairobi', label: 'Nairobi' }]

const blankForm: EstablishmentInput = {
  name: '',
  establishment_type: '',
  location: '',
  address: '',
  logo: '',
}

export function EstablishmentsPage() {
  const { user } = useAuthStore()
  const isEmployer = Boolean(user?.is_employer)
  const [filters, setFilters] = useState<EstablishmentFilters>({ q: '', type: '' })
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [form, setForm] = useState<EstablishmentInput>(blankForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [businessTypes, setBusinessTypes] = useState<CatalogOption[]>(fallbackBusinessTypes)
  const [locations, setLocations] = useState<CatalogOption[]>(fallbackLocations)
  const [page, setPage] = useState(1)
  const { establishments, loading, error, refetch } = useEstablishments(filters)
  const pageSize = 8
  const visibleEstablishments = useMemo(
    () => establishments.slice((page - 1) * pageSize, page * pageSize),
    [establishments, page],
  )

  const spotlight = useMemo(
    () => establishments.filter((item) => item.is_verified).slice(0, 3),
    [establishments],
  )

  useEffect(() => {
    endpoints.auth.workerOccupations().then((response) => {
      setBusinessTypes(response.business_types)
      setLocations(response.locations)
    }).catch(() => {
      setBusinessTypes(fallbackBusinessTypes)
      setLocations(fallbackLocations)
    })
  }, [])

  const typeOptions = [{ value: '', label: 'All types' }, ...businessTypes]

  const updateForm = (key: keyof EstablishmentInput, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
    setFormError('')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setFormError('')

    try {
      await createEstablishment({
        ...form,
        logo: form.logo || null,
      })
      setForm(blankForm)
      setShowCreateForm(false)
      refetch()
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : 'Unable to create this establishment.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ErrorBoundary>
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Establishments" title="Verified hospitality venues" actions={isEmployer ? <Button type="button" onClick={() => setShowCreateForm(true)}><Building2 className="h-4 w-4" />New establishment</Button> : undefined} />

      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-3">
        <StatCard title="Verified" value={establishments.filter((item) => item.is_verified).length} subtitle="Government & ID approved" badge={{ text: 'Trust 100%', variant: 'success' }} progress={{ value: establishments.length > 0 ? Math.round((establishments.filter((item) => item.is_verified).length / establishments.length) * 100) : 0, max: 100, label: 'Verification rate', color: '#059669' }} icon={<ShieldCheck className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" />
        <StatCard title="Locations" value={new Set(establishments.map((item) => item.location)).size} subtitle="Operating counties & hubs" sparkline={{ data: [2, 3, 3, 4, 5, 6, Math.max(new Set(establishments.map((item) => item.location)).size, 4)], type: 'line', color: '#FF6B00' }} metadata={[{ label: 'Top Hub', value: 'Nairobi' }]} icon={<MapPin className="h-5 w-5" />} iconBg="bg-orange-50 text-[#FF6B00]" />
        <StatCard title="Employer Profiles" value={establishments.reduce((sum, item) => sum + (item.verified_employers_count ?? 0), 0)} subtitle="Verified employer connections" sparkline={{ data: [1, 2, 4, 5, 4, 7, 8], type: 'bar', color: '#0A2540' }} metadata={[{ label: 'Avg per Venue', value: '2.4' }]} icon={<Building2 className="h-5 w-5" />} />
      </div>

      {isEmployer && (
          <Modal isOpen={showCreateForm} onClose={() => { setShowCreateForm(false); setForm(blankForm); setFormError('') }} title="Add your establishment" subtitle="Create an employer-owned venue profile for hiring and verification." maxWidth="lg">
            <form id="establishment-form" onSubmit={handleSubmit} className="space-y-5">
              <FormSection title="Venue details" description="Add the information workers and the verification team will use." icon={<Building2 className="h-4 w-4" />} divider={false}>
                <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Establishment name" required>
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateForm('name', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                />
              </FormField>

              <FormField label="Type" required>
                <Select searchable required value={form.establishment_type} onChange={(value) => updateForm('establishment_type', value)} options={[{ value: '', label: 'Select establishment type' }, ...businessTypes]} />
              </FormField>

              <FormField label="Location" required>
                <Select searchable required value={form.location} onChange={(value) => updateForm('location', value)} options={[{ value: '', label: 'Select location' }, ...locations]} />
              </FormField>

              <FormField label="Logo URL" helperText="Optional. Use a publicly accessible image URL.">
                <input
                  value={form.logo ?? ''}
                  onChange={(event) => updateForm('logo', event.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                />
              </FormField>
                </div>

              <FormField label="Physical location" required helperText="Enter the specific building, estate, street, or landmark manually.">
                <textarea
                  required
                  value={form.address}
                  onChange={(event) => updateForm('address', event.target.value)}
                  placeholder="e.g. Kasarani, near Seasons Road"
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                />
              </FormField>
              </FormSection>

              <ValidationErrors errors={formError ? [formError] : null} />
              <FormActions submitLabel="Create establishment" loading={saving} onCancel={() => { setShowCreateForm(false); setForm(blankForm); setFormError('') }} />
            </form>
          </Modal>
      )}

      <div className="card-kazilink p-4 sm:p-6">
        <div className="flex flex-col gap-3.5 border-b border-slate-200 pb-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div>
            <h2 className="text-lg font-black text-slate-900">Search establishments</h2>
            <p className="text-xs text-slate-500">Find trusted venues and verify their operating profile across Kenya.</p>
          </div>{filters.q || filters.type ? <button type="button" onClick={() => { setFilters({ q: '', type: '' }); setPage(1) }} className="self-start text-xs font-bold text-[#FF6B00] hover:underline sm:self-auto">Clear filters</button> : null}</div>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center"><div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={filters.q ?? ''}
                onChange={(event) => { setFilters((current) => ({ ...current, q: event.target.value })); setPage(1) }}
                placeholder="Search by venue name, location, or address..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-9 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
              {filters.q && <button type="button" onClick={() => { setFilters((current) => ({ ...current, q: '' })); setPage(1) }} className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700" aria-label="Clear establishment search"><X className="h-3.5 w-3.5" /></button>}
            </div><div className="w-full sm:w-56"><Select value={filters.type ?? ''} onChange={(value) => { setFilters((current) => ({ ...current, type: value })); setPage(1) }} options={typeOptions} className="w-full" /></div></div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"><span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">Venue type:</span>{['All', 'Restaurant', 'Hotel', 'Cafe', 'Hospitality'].map((type) => <button key={type} type="button" onClick={() => { setFilters((current) => ({ ...current, type: type === 'All' ? '' : type })); setPage(1) }} className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${(!filters.type && type === 'All') || filters.type === type ? 'bg-[#0A2540] text-white' : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'}`}>{type}</button>)}</div>
        </div>

        {loading && <p className="mt-6 text-sm text-slate-500">Loading establishments...</p>}
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {!loading && !error && (
          <div className="mt-6 space-y-5">
            {spotlight.length > 0 && (
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {spotlight.map((establishment) => (
                  <FeaturedEstablishmentCard key={establishment.id} establishment={establishment} />
                ))}
              </div>
            )}

            {establishments.length === 0 ? (
              <EmptyState
                title="No establishments match your search"
                description="Try adjusting the search criteria."
                icon={<Building2 className="h-8 w-8" />}
                action={isEmployer ? <Button type="button" onClick={() => setShowCreateForm(true)}><Building2 className="h-4 w-4" />Add establishment</Button> : undefined}
              />
            ) : (
              <div className="grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-3">
                {visibleEstablishments.map((establishment) => <EstablishmentCard key={establishment.id} establishment={establishment} />)}
              </div>
            )}
            <Pagination page={page} pageSize={pageSize} total={establishments.length} onPageChange={setPage} />
          </div>
        )}
      </div>
    </section>
    </ErrorBoundary>
  )
}

function FeaturedEstablishmentCard({ establishment }: { establishment: { id: number; name: string; location: string; establishment_type: string; is_verified: boolean } }) {
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">Featured</p>
      <h3 className="mt-2 text-lg font-black text-slate-900">{establishment.name}</h3>
      <p className="mt-2 text-sm text-slate-600">{establishment.establishment_type} · {establishment.location}</p>
      <Link to={`/establishments/${establishment.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#FF6B00]">
        Explore venue <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
