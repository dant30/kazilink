// frontend/src/features/workers/pages/WorkerProfilePage.tsx
import { Avatar } from '../../../shared/components/ui/Avatar'
import { Badge } from '../../../shared/components/ui/Badge'
import { Button } from '../../../shared/components/ui/Button'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { ProgressBar } from '../../../shared/components/ui/ProgressBar'
import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '../../auth/store'
import { useWorkerProfile } from '../hooks/useWorkerProfile'
import { useUpdateWorkerProfile } from '../hooks/useUpdateWorkerProfile'
import { WorkerInfoCard, WorkerStatusCard, WorkerStatsCard } from '../components'
import { ErrorBoundary } from '../../../shared/components/ui/ErrorBoundary'
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog'
import { endpoints } from '../../../core/api'
import { Link } from 'react-router-dom'
import { Briefcase, Check, CheckCircle2, ChevronDown, ChevronUp, Clock, Info, Languages, Search, Share2, ShieldAlert, ShieldCheck, Star, UserCheck, Zap } from 'lucide-react'
import type { UpdateWorkerProfilePayload } from '../types'
import { ReferralCard } from '../../accounts/components/ReferralCard'
import { VerificationPanel } from '../../accounts/components/VerificationPanel'
import { RatingStars } from '../../../shared/components/ui/RatingStars'

export function WorkerProfilePage() {
	const { user } = useAuthStore()
	const { profile, loading, error, refresh } = useWorkerProfile()
	const { updating, error: updateError, success, updateProfile, clearError, clearSuccess } = useUpdateWorkerProfile()
	const [form, setForm] = useState<UpdateWorkerProfilePayload>({})
	const [creditBalance, setCreditBalance] = useState<number | null>(null)
	const [confirmBoost, setConfirmBoost] = useState(false)
	const [boosting, setBoosting] = useState(false)
	const [boostFeedback, setBoostFeedback] = useState('')
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
	const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
	const [showChecklist, setShowChecklist] = useState(false)
	const [copiedLink, setCopiedLink] = useState(false)
	const [skillOptions, setSkillOptions] = useState<Array<{ value: string; label: string }>>([])
	const [availabilityOptions, setAvailabilityOptions] = useState<Array<{ value: string; label: string }>>([])
	const [occupationOptions, setOccupationOptions] = useState<Array<{ value: string; label: string }>>([])
	const [languageOptions, setLanguageOptions] = useState<Array<{ value: string; label: string }>>([])
	const [locationOptions, setLocationOptions] = useState<Array<{ value: string; label: string }>>([])
	const [focusField, setFocusField] = useState<string | undefined>()

	useEffect(() => {
		if (!profile) return
		setForm({
			email: profile.user.email,
			gender: profile.user.gender,
			date_of_birth: profile.user.date_of_birth,
			primary_role: profile.primary_role,
			location: profile.location,
			years_of_experience: profile.years_of_experience,
			expected_daily_rate_ksh: profile.expected_daily_rate_ksh,
			expected_monthly_salary_ksh: profile.expected_monthly_salary_ksh,
			availability: profile.availability,
			bio: profile.bio,
			skills: profile.skills,
			languages: profile.languages,
			secondary_roles: profile.secondary_roles,
			last_employer: profile.last_employer,
		})
	}, [profile])

	useEffect(() => () => { if (avatarPreview) URL.revokeObjectURL(avatarPreview) }, [avatarPreview])

	useEffect(() => {
		endpoints.credits.wallet().then((response) => setCreditBalance(response.wallet.balance)).catch(() => setCreditBalance(null))
	}, [])

	useEffect(() => {
		endpoints.auth.workerOccupations().then((response) => { setSkillOptions(response.skills); setAvailabilityOptions(response.availability); setOccupationOptions(response.occupations); setLanguageOptions(response.languages); setLocationOptions(response.locations) }).catch(() => { setSkillOptions([]); setAvailabilityOptions([]); setOccupationOptions([]); setLanguageOptions([]); setLocationOptions([]) })
	}, [])
	const workerCriteria = [
		['photo', 'Professional profile photo', Boolean(profile?.avatar || profile?.user.avatar || form.avatar)],
		['role_rate', 'Primary role and daily shift rate', Boolean((form.primary_role || profile?.primary_role)?.trim() && Number(form.expected_daily_rate_ksh ?? profile?.expected_daily_rate_ksh) > 0)],
		['location', 'Operating Kenyan town or county', Boolean((form.location || profile?.location)?.trim())],
		['bio', 'Experience summary and professional bio', Boolean((form.bio || profile?.bio)?.trim() && (form.bio || profile?.bio)!.length >= 20)],
		['skills', 'Hospitality skills and languages', Boolean((form.skills || profile?.skills)?.length && (form.languages || profile?.languages)?.length)],
		['experience', 'Track record and years of experience', Number(form.years_of_experience ?? profile?.years_of_experience) > 0],
		['trust', 'Verified reference or identity', Boolean(profile?.is_reference_checked || profile?.user.is_id_verified || profile?.background_check_verified)],
	] as const
	const profileStrength = Math.round((workerCriteria.filter((item) => item[2]).length / workerCriteria.length) * 100)
	const strengthColor: 'rose' | 'amber' | 'orange' | 'emerald' = profileStrength < 40 ? 'rose' : profileStrength < 70 ? 'amber' : profileStrength < 90 ? 'orange' : 'emerald'
	const strengthTier = profileStrength < 40 ? 'Incomplete' : profileStrength < 70 ? 'Basic Candidate' : profileStrength < 90 ? 'High Demand' : 'All-Star Verified'
	const isDirty = useMemo(() => Boolean(profile && ((form.email ?? '') !== (profile.user.email ?? '') || (form.gender ?? '') !== (profile.user.gender ?? '') || (form.date_of_birth ?? '') !== (profile.user.date_of_birth ?? '') || (form.primary_role ?? '') !== (profile.primary_role ?? '') || (form.location ?? '') !== (profile.location ?? '') || Number(form.years_of_experience ?? 0) !== Number(profile.years_of_experience ?? 0) || Number(form.expected_daily_rate_ksh ?? 0) !== Number(profile.expected_daily_rate_ksh ?? 0) || (form.availability ?? '') !== (profile.availability ?? '') || (form.bio ?? '') !== (profile.bio ?? '') || JSON.stringify(form.skills || []) !== JSON.stringify(profile.skills || []) || JSON.stringify(form.languages || []) !== JSON.stringify(profile.languages || []) || form.avatar instanceof File)), [form, profile])
	const avatarSrc = avatarPreview || (form.avatar instanceof File ? URL.createObjectURL(form.avatar) : profile?.avatar || profile?.user.avatar)
	const discardChanges = () => { if (!profile) return; setForm({ email: profile.user.email, gender: profile.user.gender, date_of_birth: profile.user.date_of_birth, primary_role: profile.primary_role, location: profile.location, years_of_experience: profile.years_of_experience, expected_daily_rate_ksh: profile.expected_daily_rate_ksh, expected_monthly_salary_ksh: profile.expected_monthly_salary_ksh, availability: profile.availability, bio: profile.bio, skills: profile.skills, languages: profile.languages, secondary_roles: profile.secondary_roles, last_employer: profile.last_employer }); if (avatarPreview) { URL.revokeObjectURL(avatarPreview); setAvatarPreview(null) }; clearError() }
	const copyProfileLink = async () => { try { await navigator.clipboard.writeText(window.location.href) } finally { setCopiedLink(true); window.setTimeout(() => setCopiedLink(false), 2000) } }

	const handleStatusChange = async (field: 'open_to_work', value: boolean) => {
		try {
			clearError()
			await updateProfile({ [field]: value })
		} catch (err) {
			console.error('Failed to update status:', err)
		}
	}

	const updateForm = (field: keyof UpdateWorkerProfilePayload, value: string | number | string[] | File) => {
		if (field === 'avatar' && value instanceof File) { if (avatarPreview) URL.revokeObjectURL(avatarPreview); setAvatarPreview(URL.createObjectURL(value)) }
		setForm((current) => ({ ...current, [field]: value }))
		clearError()
	}

	const saveProfile = async () => {
		try {
			clearError()
			const { email, gender, date_of_birth, ...profileData } = form
			if (email !== profile?.user.email || gender !== profile?.user.gender || date_of_birth !== profile?.user.date_of_birth) await endpoints.auth.updateMe({ email: email || null, gender: gender || '', date_of_birth: date_of_birth || null })
			await updateProfile(profileData)
		} catch {
			// The update hook exposes the error state to the page.
		}
	}

	const boostProfile = async () => {
		setBoosting(true)
		setBoostFeedback('')
		try {
			await endpoints.workers.boostProfileWithCredits(`profile-boost:${user?.id || 'me'}:${Date.now()}`)
			const [walletResponse, profileResponse] = await Promise.all([endpoints.credits.wallet(), endpoints.workers.me()])
			setCreditBalance(walletResponse.wallet.balance)
			setForm((current) => ({ ...current, ...profileResponse }))
			await refresh()
			setConfirmBoost(false)
			setBoostFeedback(profileResponse.profile_boost_until ? `Profile boosted until ${new Date(profileResponse.profile_boost_until).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}.` : 'Profile boosted for 7 days.')
		} catch (error) {
			setBoostFeedback(error instanceof Error ? error.message : 'The profile boost failed. Your credits were not charged.')
		} finally {
			setBoosting(false)
		}
	}

	if (error) {
		return (
			<section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
					<p className="text-red-700 font-semibold">{error}</p>
					<Button onClick={refresh} className="mt-4">
						Try again
					</Button>
				</div>
			</section>
		)
	}
	if (loading && !profile) {
		return <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8" aria-label="Loading worker profile" aria-busy="true"><div className="h-96 animate-pulse rounded-2xl bg-slate-200" /></section>
	}
	if (!profile) return <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Worker profile is unavailable.</div></section>

	return (
		<ErrorBoundary>
		<section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
			<PageHeader
				eyebrow="Worker Profile & Verified Resume"
				title={user?.full_name || profile?.user.full_name || 'Worker Profile'}
				description="Your verified hospitality credentials, availability, and rating across Kenyan venues."
				actions={<div className="flex w-full flex-nowrap gap-2 sm:w-auto"><Button variant="outline" size="sm" onClick={() => void copyProfileLink()} leftIcon={copiedLink ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />} className="min-w-0 flex-1 whitespace-nowrap sm:flex-none">{copiedLink ? 'Link copied' : 'Share profile'}</Button><Link to="/jobs" className="min-w-0 flex-1 sm:flex-none"><Button size="sm" leftIcon={<Search className="h-4 w-4" />} className="w-full whitespace-nowrap">Browse shifts</Button></Link></div>}
			>
				<div className="mt-3 flex items-center gap-3">
					<label className="group relative cursor-pointer rounded-full" title="Change profile photo">
						<div className={profile?.profile_boost_until && new Date(profile.profile_boost_until) > new Date() ? 'rounded-full ring-2 ring-amber-400 ring-offset-2' : ''}><Avatar src={avatarSrc} name={user?.full_name || 'Worker'} size="lg" isVerified={Boolean(profile?.is_reference_checked || profile?.user.is_id_verified)} /></div>
						<span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/65 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">Change</span>
						<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) updateForm('avatar', file) }} />
					</label>
					<div className="space-y-1">
						<p className="text-xs text-slate-300"><strong className="text-white">{form.primary_role || profile?.primary_role || 'Hospitality specialist'}</strong> · {form.location || profile?.location || 'Kenya'}</p>
						<p className="text-xs text-slate-300">Daily rate: <strong className="text-white">KSh {form.expected_daily_rate_ksh || profile?.expected_daily_rate_ksh || 0}</strong></p>
						<RatingStars rating={profile.rating} reviews={profile.reviews_count} className="text-xs text-slate-300" />
					</div>
				</div>
			</PageHeader>

			<WorkerStatsCard profile={profile} loading={loading} />
			<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><ProgressBar value={profileStrength} color={strengthColor} showPercentage={false} barHeightClassName="h-3" label={<span className="flex items-center gap-2 font-bold text-slate-900">{profileStrength >= 80 ? <ShieldCheck className="h-4 w-4 text-emerald-600" /> : <ShieldAlert className="h-4 w-4 text-amber-600" />}Candidate profile strength</span>} rightLabel={<span className="flex items-center gap-2"><Badge variant={profileStrength >= 90 ? 'success' : 'warning'} size="sm">{profileStrength}% · {strengthTier}</Badge><button type="button" className="text-xs font-bold text-[#FF6B00]" onClick={() => setShowChecklist((value) => !value)}>{showChecklist ? 'Hide details' : 'View checklist'} {showChecklist ? <ChevronUp className="inline h-3.5 w-3.5" /> : <ChevronDown className="inline h-3.5 w-3.5" />}</button></span>} />{showChecklist && <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">{workerCriteria.map(([id, label, met]) => <button key={id} type="button" onClick={() => { setFocusField(id); document.getElementById('professional-details-trigger')?.click() }} className={`flex items-center gap-2 rounded-xl p-2.5 text-left text-xs transition ${met ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>{met ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <span className="h-2 w-2 rounded-full bg-slate-300" />}{label}</button>)}</div>}</div>
			<div className="flex rounded-2xl border border-slate-200 bg-slate-100 p-1"><button type="button" onClick={() => setActiveTab('edit')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold ${activeTab === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>Professional details</button><button type="button" onClick={() => setActiveTab('preview')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold ${activeTab === 'preview' ? 'bg-[#0A2540] text-white shadow-sm' : 'text-slate-600'}`}>Employer live view</button></div>

			{/* Success Message */}
			{success && <div role="status" aria-live="polite" className="flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 p-4"><span className="flex items-center gap-2 font-semibold text-green-700"><CheckCircle2 className="h-5 w-5" />Profile updated successfully.</span><button type="button" className="text-xs font-bold text-green-700" onClick={clearSuccess}>Dismiss</button></div>}

			{/* Error Message */}
			{updateError && (
				<div role="alert" aria-live="assertive" className="rounded-2xl border border-red-200 bg-red-50 p-4">
					<p className="text-red-700 font-semibold">{updateError}</p>
				</div>
			)}

			{activeTab === 'edit' && <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
				<div className="space-y-6">
					{/* Professional Details */}
					<WorkerInfoCard profile={profile} loading={loading} values={form} onChange={updateForm} skillOptions={skillOptions} availabilityOptions={availabilityOptions} occupationOptions={occupationOptions} languageOptions={languageOptions} locationOptions={locationOptions} isDirty={isDirty} saving={updating} onSave={saveProfile} onDiscard={discardChanges} focusField={focusField} />

					<VerificationPanel email={form.email ?? profile.user.email} phoneVerified={profile.user.is_phone_verified} idVerified={profile.user.is_id_verified} />
				</div>

				{/* Sidebar */}
				<aside className="space-y-6">
					{/* Status Card */}
					<WorkerStatusCard profile={profile} loading={loading} onStatusChange={handleStatusChange} />

					<ReferralCard />

					<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">Trust & visibility</h3>
						<div className="mt-4 space-y-3 text-sm">
							<div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1 text-slate-500">Reference check <span title="References help employers trust your work history."><Info className="h-3.5 w-3.5" /></span></span><Badge variant={profile?.is_reference_checked ? 'success' : 'warning'} size="sm">{profile?.is_reference_checked ? 'Checked' : 'Pending'}</Badge></div>
							<div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1 text-slate-500">Background check <span title="A verified background check strengthens employer confidence."><Info className="h-3.5 w-3.5" /></span></span><Badge variant={profile?.background_check_verified ? 'success' : 'neutral'} size="sm">{profile?.background_check_verified ? 'Verified' : 'Not verified'}</Badge></div>
							<div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1 text-slate-500">History sharing <span title="When enabled, employers can pay to access your verified employment history."><Info className="h-3.5 w-3.5" /></span></span><Badge variant={profile?.consent_history_sharing ? 'success' : 'neutral'} size="sm">{profile?.consent_history_sharing ? 'Allowed' : 'Private'}</Badge></div>
							<div className="flex items-center justify-between gap-3"><span className="text-slate-500">National ID</span><span className="font-semibold text-slate-700">{profile?.national_id_masked || 'Not provided'}</span></div>
						</div>
					</div>

					<div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
						<div className="flex items-center justify-between gap-3"><h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">Profile visibility</h3><span className="text-xs font-bold text-[#C2410C]">3 credits</span></div>
						<p className="mt-2 text-sm text-slate-600">Boosted profiles appear at the top of employer searches for 7 days.</p>
						{profile?.profile_boost_until && new Date(profile.profile_boost_until) > new Date() && <p className="mt-2 text-xs font-bold text-amber-800">Active until {new Date(profile.profile_boost_until).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}</p>}
						<p className="mt-3 text-xs text-slate-600">Balance: <strong>{creditBalance ?? '...'}</strong> Kazi Credits</p>
						{creditBalance === 0 && <p className="mt-2 text-xs font-medium text-amber-800">You need 3 credits. <Link to="/payments" className="font-bold underline">Buy Kazi Credits</Link></p>}
						<Button className="mt-4 w-full" disabled={boosting || creditBalance === null || creditBalance < 3} onClick={() => setConfirmBoost(true)}>{profile?.profile_boost_until ? 'Boost again' : 'Boost profile for 7 days'}</Button>
						{boostFeedback && <p className="mt-3 text-xs font-semibold text-emerald-700">{boostFeedback}</p>}
					</div>
				</aside>
			</div>}

			{activeTab === 'preview' && <div className="space-y-6"><div className="rounded-3xl bg-gradient-to-b from-[#0A2540] to-[#071D32] p-8 text-white shadow-md"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><Avatar src={avatarSrc} name={user?.full_name || 'Worker'} size="xl" isVerified={Boolean(profile?.is_reference_checked)} /><div><h2 className="text-2xl font-black text-white">{user?.full_name || profile?.user.full_name}</h2><p className="mt-1 text-sm text-slate-300">{form.primary_role || profile?.primary_role || 'Hospitality specialist'} · {form.location || profile?.location || 'Kenya'}</p><div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-300"><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-[#FF6B00]" />{form.years_of_experience || profile?.years_of_experience || 0} years experience</span><span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{Number(profile?.rating ?? 0).toFixed(1)} ({profile?.reviews_count ?? 0} reviews)</span><span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-emerald-400" />{profile?.punctuality_score ?? 0}% punctuality</span></div></div></div><Button variant="outline" onClick={() => setActiveTab('edit')} className="border-white/30 text-white">Back to edit</Button></div></div><div className="grid gap-6 md:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="flex items-center gap-2 font-bold text-slate-900"><Briefcase className="h-5 w-5 text-[#FF6B00]" />Shift rates and availability</h3><div className="mt-4 grid grid-cols-2 gap-3 text-xs"><div className="rounded-xl border border-orange-100 bg-orange-50 p-3"><span className="text-slate-500">Daily shift rate</span><strong className="mt-1 block text-lg text-[#0A2540]">KSh {form.expected_daily_rate_ksh || profile?.expected_daily_rate_ksh || 0}</strong></div><div className="rounded-xl bg-slate-50 p-3"><span className="text-slate-500">Availability</span><strong className="mt-1 block capitalize text-slate-800">{(form.availability || profile?.availability || 'Immediate').replace('_', ' ')}</strong></div></div><p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{form.bio || profile?.bio || 'No bio summary provided yet.'}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="flex items-center gap-2 font-bold text-slate-900"><CheckCircle2 className="h-5 w-5 text-emerald-600" />Verified skills and languages</h3><div className="mt-4 flex flex-wrap gap-2">{(form.skills || profile?.skills || []).map((skill) => <span key={skill} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"><Check className="mr-1 inline h-3 w-3" />{skill}</span>)}{(form.languages || profile?.languages || []).map((language) => <span key={language} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"><Languages className="mr-1 inline h-3 w-3" />{language}</span>)}</div><div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700"><p><UserCheck className="mr-2 inline h-4 w-4 text-emerald-600" />Kenyan phone verified</p><p><ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-600" />Identity and reference checks shown privately</p></div></div></div></div>}

			<ConfirmDialog
				isOpen={confirmBoost}
				title="Boost your profile?"
				message={<span>This will use <strong>3 Kazi Credits</strong> and boost your profile for 7 days. Your balance is <strong>{creditBalance ?? '...'}</strong>.</span>}
				confirmLabel="Use 3 Credits"
				loading={boosting}
				onCancel={() => setConfirmBoost(false)}
				onConfirm={boostProfile}
			/>
		</section>
		</ErrorBoundary>
	)
}

