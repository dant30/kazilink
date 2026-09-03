import { useEffect, useState } from 'react'
import { Avatar } from '../../../shared/components/ui/Avatar'
import { Badge } from '../../../shared/components/ui/Badge'
import { Button } from '../../../shared/components/ui/Button'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { useEmployerProfile } from '../hooks/useEmployerProfile'
import { useUpdateEmployerProfile } from '../hooks/useUpdateEmployerProfile'
import { EmployerEstablishmentsCard, EmployerInfoCard, EmployerSettingsCard, EmployerStatsCard } from '../components'
import type { UpdateEmployerProfilePayload } from '../types'
import { ErrorBoundary } from '../../../shared/components/ui/ErrorBoundary'

export function EmployerProfilePage() {
  const { profile, establishments, loading, error, refresh } = useEmployerProfile()
  const { updating, success, error: updateError, updateProfile } = useUpdateEmployerProfile()
  const [form, setForm] = useState<UpdateEmployerProfilePayload>({})

  useEffect(() => {
    if (profile) setForm({ business_name: profile.business_name, location: profile.location, business_type: profile.business_type, contact_person: profile.contact_person })
  }, [profile])

  const change = (field: keyof UpdateEmployerProfilePayload, value: string) => setForm((current) => ({ ...current, [field]: value }))
  const changeSetting = async (field: 'auto_shortlist' | 'verified_only', value: boolean) => { await updateProfile({ [field]: value }) }
  const save = async () => { await updateProfile(form) }

  if (loading && !profile) return <section className="mx-auto max-w-6xl px-4 py-8" aria-label="Loading employer profile" aria-busy="true"><Skeleton className="h-96 w-full rounded-2xl" /></section>
  if (error && !profile) return <section className="mx-auto max-w-6xl px-4 py-8"><div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"><p className="font-semibold text-red-700">{error}</p><Button onClick={() => refresh()} className="mt-4">Try again</Button></div></section>
  if (!profile) return null

  const strength = Math.round(([profile.business_name, profile.location, profile.business_type, profile.contact_person, establishments.length > 0].filter(Boolean).length / 5) * 100)
  return <ErrorBoundary><section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <PageHeader
      eyebrow="Employer profile"
      title={profile.business_name || profile.user.full_name}
      actions={
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">Profile strength</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl font-black text-white">{strength}%</span>
            <div className="h-2.5 w-24 rounded-full bg-white/15">
              <div className="h-2.5 rounded-full bg-[#FF6B00]" style={{ width: `${strength}%` }} />
            </div>
          </div>
        </div>
      }
    >
      <div className="mt-3 flex items-center gap-3">
        <Avatar name={profile.user.full_name} size="lg" isVerified={profile.verified_business} />
        <div className="flex flex-wrap gap-2">
        <Badge variant={profile.verified_business ? 'verified' : 'warning'}>{profile.verified_business ? 'Verified business' : 'Verification pending'}</Badge>
        <Badge variant="info">{profile.active_jobs_count > 0 ? 'Hiring actively' : 'No open roles'}</Badge>
        </div>
      </div>
    </PageHeader>
    {success && <div className="rounded-2xl border border-green-200 bg-green-50 p-4 font-semibold text-green-700">Profile updated successfully.</div>}
    {updateError && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">{updateError}</div>}
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"><div className="space-y-6"><EmployerInfoCard values={form} onChange={change} /><EmployerEstablishmentsCard establishments={establishments} /></div><aside className="space-y-6"><EmployerSettingsCard profile={profile} onChange={changeSetting} /><EmployerStatsCard profile={profile} /></aside></div>
    <div className="flex justify-end rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><Button onClick={save} disabled={updating}>{updating ? 'Saving...' : 'Save profile'}</Button></div>
  </section></ErrorBoundary>
}
