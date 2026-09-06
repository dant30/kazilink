import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Check, CheckCircle2, ChevronDown, ChevronUp, Edit3, Eye, Plus, Share2, ShieldAlert, ShieldCheck, Users, Zap } from 'lucide-react'
import { Avatar } from '../../../shared/components/ui/Avatar'
import { Badge } from '../../../shared/components/ui/Badge'
import { Button } from '../../../shared/components/ui/Button'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { ProgressBar } from '../../../shared/components/ui/ProgressBar'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { useEmployerProfile } from '../hooks/useEmployerProfile'
import { useUpdateEmployerProfile } from '../hooks/useUpdateEmployerProfile'
import { EmployerEstablishmentsCard, EmployerInfoCard, EmployerSettingsCard, EmployerStatsCard } from '../components'
import type { UpdateEmployerProfilePayload } from '../types'
import { ErrorBoundary } from '../../../shared/components/ui/ErrorBoundary'
import { ReferralCard } from '../../accounts/components/ReferralCard'
import { endpoints } from '../../../core/api'

export function EmployerProfilePage() {
  const { profile, establishments, loading, error, refresh } = useEmployerProfile()
  const { updating, success, error: updateError, updateProfile, clearError, clearSuccess } = useUpdateEmployerProfile()
  const [form, setForm] = useState<UpdateEmployerProfilePayload>({})
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [showChecklist, setShowChecklist] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [creditBalance, setCreditBalance] = useState<number | null>(null)
  const [businessTypes, setBusinessTypes] = useState<Array<{ value: string; label: string }>>([])
  const [locations, setLocations] = useState<Array<{ value: string; label: string }>>([])

  useEffect(() => {
    if (profile) setForm({ business_name: profile.business_name, location: profile.location, business_type: profile.business_type, contact_person: profile.contact_person, avatar: profile.avatar })
  }, [profile])

  useEffect(() => () => { if (avatarPreview) URL.revokeObjectURL(avatarPreview) }, [avatarPreview])

  useEffect(() => {
    endpoints.credits.wallet().then((response) => setCreditBalance(response.wallet.balance)).catch(() => setCreditBalance(null))
  }, [])

  useEffect(() => {
    endpoints.auth.workerOccupations().then((response) => { setBusinessTypes(response.business_types); setLocations(response.locations) }).catch(() => { setBusinessTypes([]); setLocations([]) })
  }, [])

  const change = (field: keyof UpdateEmployerProfilePayload, value: string | File) => {
    if (field === 'avatar' && value instanceof File) {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
      setAvatarPreview(URL.createObjectURL(value))
    }
    setForm((current) => ({ ...current, [field]: value }))
    clearError()
  }
  const changeSetting = async (field: 'auto_shortlist' | 'verified_only', value: boolean) => { await updateProfile({ [field]: value }) }
  const save = async () => { await updateProfile(form) }
  const isDirty = useMemo(() => Boolean(profile && ((form.business_name ?? '') !== (profile.business_name ?? '') || (form.location ?? '') !== (profile.location ?? '') || (form.business_type ?? '') !== (profile.business_type ?? '') || (form.contact_person ?? '') !== (profile.contact_person ?? '') || form.avatar instanceof File)), [form, profile])
  const discard = () => { if (!profile) return; setForm({ business_name: profile.business_name, location: profile.location, business_type: profile.business_type, contact_person: profile.contact_person, avatar: profile.avatar }); if (avatarPreview) { URL.revokeObjectURL(avatarPreview); setAvatarPreview(null) }; clearError() }
  const criteria = [
    ['business_name', 'Registered business name', Boolean(form.business_name?.trim() || profile?.business_name?.trim())],
    ['location', 'Primary operating location', Boolean(form.location?.trim() || profile?.location?.trim())],
    ['business_type', 'Hospitality business category', Boolean(form.business_type?.trim() || profile?.business_type?.trim())],
    ['contact_person', 'Authorised hiring manager', Boolean(form.contact_person?.trim() || profile?.contact_person?.trim())],
    ['establishments', 'At least one venue or branch', establishments.length > 0],
    ['verified', 'KaziLink business verification', Boolean(profile?.verified_business)],
  ] as const
  const strength = Math.round((criteria.filter((item) => item[2]).length / criteria.length) * 100)
  const strengthColor: 'rose' | 'amber' | 'orange' | 'emerald' = strength < 40 ? 'rose' : strength < 70 ? 'amber' : strength < 90 ? 'orange' : 'emerald'
  const strengthTier = strength < 40 ? 'Setup Needed' : strength < 70 ? 'Basic Profile' : strength < 90 ? 'Hiring Ready' : 'Fully Verified'
  const avatarSrc = avatarPreview || (typeof form.avatar === 'string' ? form.avatar : profile?.avatar)
  const copyProfileLink = async () => { try { await navigator.clipboard.writeText(window.location.href) } finally { setCopiedLink(true); window.setTimeout(() => setCopiedLink(false), 2000) } }

  if (loading && !profile) return <section className="mx-auto max-w-6xl px-4 py-8" aria-label="Loading employer profile" aria-busy="true"><Skeleton className="h-96 w-full rounded-2xl" /></section>
  if (error && !profile) return <section className="mx-auto max-w-6xl px-4 py-8"><div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"><p className="font-semibold text-red-700">{error}</p><Button onClick={() => refresh()} className="mt-4">Try again</Button></div></section>
  if (!profile) return null

  return <ErrorBoundary><section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <PageHeader
      eyebrow="Employer Workspace"
      title={form.business_name || profile.business_name || profile.user.full_name}
      description="Manage your verified venues, hiring standards, and business reputation."
      actions={<div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => void copyProfileLink()} leftIcon={copiedLink ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}>{copiedLink ? 'Link copied' : 'Share profile'}</Button><Link to="/jobs/new"><Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Post a shift</Button></Link></div>}
    >
      <div className="mt-3 flex items-center gap-3">
        <label className="group relative cursor-pointer rounded-full" title="Change business logo">
          <Avatar src={avatarSrc} name={profile.user.full_name} size="lg" isVerified={profile.verified_business} />
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/65 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">Change</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) change('avatar', file) }} />
        </label>
        <div className="space-y-1">
          <div className="flex flex-wrap gap-2">
            <Badge variant={profile.verified_business ? 'verified' : 'warning'}>{profile.verified_business ? 'Verified business' : 'Verification pending'}</Badge>
            <Badge variant="info">{profile.active_jobs_count > 0 ? 'Hiring actively' : 'No open roles'}</Badge>
          </div>
          <p className="text-xs text-slate-300"><strong className="text-white">{form.business_type || profile.business_type || 'Hospitality business'}</strong> · {form.location || profile.location || 'Kenya'}</p>
          <p className="text-xs text-slate-300">Hiring contact: <strong className="text-white">{form.contact_person || profile.contact_person || profile.user.full_name}</strong> · {establishments.length} {establishments.length === 1 ? 'venue' : 'venues'}</p>
        </div>
      </div>
    </PageHeader>
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><ProgressBar value={strength} color={strengthColor} showPercentage={false} barHeightClassName="h-3" label={<span className="flex items-center gap-2 font-bold text-slate-900">{strength >= 80 ? <ShieldCheck className="h-4 w-4 text-emerald-600" /> : <ShieldAlert className="h-4 w-4 text-amber-600" />}Business trust and profile strength</span>} rightLabel={<span className="flex items-center gap-2"><Badge variant={strength >= 90 ? 'success' : 'warning'} size="sm">{strength}% · {strengthTier}</Badge><button type="button" className="text-xs font-bold text-[#FF6B00]" onClick={() => setShowChecklist((value) => !value)}>{showChecklist ? 'Hide details' : 'View checklist'} {showChecklist ? <ChevronUp className="inline h-3.5 w-3.5" /> : <ChevronDown className="inline h-3.5 w-3.5" />}</button></span>} />{showChecklist && <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">{criteria.map(([id, label, met]) => <div key={id} className={`flex items-center gap-2 rounded-xl p-2.5 text-xs ${met ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-600'}`}>{met ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <span className="h-2 w-2 rounded-full bg-slate-300" />}{label}</div>)}</div>}</div>
    <div className="flex rounded-2xl border border-slate-200 bg-slate-100 p-1"><button type="button" onClick={() => setActiveTab('edit')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold ${activeTab === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}><Edit3 className="h-3.5 w-3.5" />Edit profile and settings</button><button type="button" onClick={() => setActiveTab('preview')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold ${activeTab === 'preview' ? 'bg-[#0A2540] text-white shadow-sm' : 'text-slate-600'}`}><Eye className="h-3.5 w-3.5 text-[#FF6B00]" />Candidate live preview</button></div>
    {success && <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 p-4 font-semibold text-green-700"><span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" />Profile updated successfully.</span><button type="button" className="text-xs font-bold" onClick={clearSuccess}>Dismiss</button></div>}
    {updateError && <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700"><span className="flex items-center gap-2"><ShieldAlert className="h-5 w-5" />{updateError}</span><button type="button" className="text-xs font-bold" onClick={clearError}>Dismiss</button></div>}
    {activeTab === 'edit' ? <><div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"><div className="space-y-6"><EmployerInfoCard values={form} onChange={change} businessTypes={businessTypes} locations={locations} /><EmployerEstablishmentsCard establishments={establishments} /></div><aside className="space-y-6"><EmployerSettingsCard profile={profile} onChange={changeSetting} /><EmployerStatsCard profile={profile} /><div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700">Hiring visibility</h3><Zap className="h-5 w-5 text-[#FF6B00]" /></div><p className="mt-2 text-sm text-slate-600">Employer visibility is applied to individual jobs, not the employer profile.</p><p className="mt-3 text-xs text-slate-600">Balance: <strong>{creditBalance ?? '...'}</strong> Kazi Credits</p><div className="mt-4 space-y-2 text-xs text-slate-700"><div className="flex justify-between rounded-lg bg-white px-3 py-2"><span>Feature a job for 24 hours</span><strong className="text-[#FF6B00]">3 credits</strong></div><div className="flex justify-between rounded-lg bg-white px-3 py-2"><span>Boost a job for 7 days</span><strong className="text-[#FF6B00]">5 credits</strong></div></div><div className="mt-4 flex gap-2"><Link to="/jobs" className="flex-1"><Button variant="outline" size="sm" className="w-full">Manage jobs</Button></Link><Link to="/payments" className="flex-1"><Button size="sm" className="w-full">Buy credits</Button></Link></div></div><ReferralCard /></aside></div><div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur-sm"><span className="text-xs font-semibold text-slate-500">{isDirty ? 'Unsaved profile modifications' : 'All changes saved to KaziLink'}</span><div className="flex gap-2">{isDirty && <Button variant="outline" size="sm" onClick={discard} disabled={updating}>Discard</Button>}<Button onClick={save} disabled={updating || !isDirty} isLoading={updating}>{updating ? 'Saving changes...' : 'Save profile'}</Button></div></div></> : <div className="space-y-6"><div className="rounded-3xl bg-gradient-to-b from-[#0A2540] to-[#071D32] p-8 text-white shadow-md"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><Avatar src={avatarSrc} name={profile.business_name || profile.user.full_name} size="xl" isVerified={profile.verified_business} /><div><h2 className="text-2xl font-black text-white">{form.business_name || profile.business_name || profile.user.full_name}</h2><p className="mt-1 text-sm text-slate-300">{form.business_type || profile.business_type || 'Hospitality business'} · {form.location || profile.location || 'Kenya'}</p><div className="mt-3 flex gap-4 text-xs text-slate-300"><span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-[#FF6B00]" />{profile.total_hires} hires</span><span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-amber-400" />{profile.average_response_time_minutes || 'Under 1'}m response</span></div></div></div><Button variant="outline" onClick={() => setActiveTab('edit')} className="border-white/30 text-white">Back to edit</Button></div></div><div className="grid gap-6 md:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="flex items-center gap-2 font-bold text-slate-900"><Building2 className="h-5 w-5 text-[#FF6B00]" />Active establishments</h3><div className="mt-4 space-y-3">{establishments.length ? establishments.map((establishment) => <div key={establishment.id} className="rounded-xl bg-slate-50 p-3"><p className="font-bold text-slate-900">{establishment.name}</p><p className="text-xs text-slate-500">{establishment.establishment_type} · {establishment.location}</p></div>) : <p className="text-sm text-slate-500">No public venue branches listed yet.</p>}</div></div><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="flex items-center gap-2 font-bold text-slate-900"><ShieldCheck className="h-5 w-5 text-emerald-600" />Hiring standards</h3><div className="mt-4 space-y-3 text-sm text-slate-600"><p>Verified business status: {profile.verified_business ? 'Confirmed' : 'Pending review'}.</p><p>Hiring preference: {profile.verified_only ? 'Verified workers only' : 'Open candidate pool'}.</p><Link to="/jobs/new" className="inline-flex items-center gap-2 font-bold text-[#FF6B00]">Post a new shift <Plus className="h-4 w-4" /></Link></div></div></div></div>}
  </section></ErrorBoundary>
}
