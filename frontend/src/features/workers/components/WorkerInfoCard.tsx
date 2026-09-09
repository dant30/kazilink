// frontend/src/features/workers/components/WorkerInfoCard.tsx
import { BriefcaseBusiness, Edit3 } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { UpdateWorkerProfilePayload, WorkerAvailability, WorkerProfile } from '../types'
import { FormField, FormSection } from '../../../shared/components/forms'
import { Input } from '../../../shared/components/ui/Input'
import { Select } from '../../../shared/components/ui/Select'
import { DatePicker } from '../../../shared/components/ui/DatePicker'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { Chip } from '../../../shared/components/ui/Chip'
import { Modal } from '../../../shared/components/ui/Modal'
import { Button } from '../../../shared/components/ui/Button'
import { getAdultDateOfBirthMax } from '../../../core/utils/date'

interface WorkerInfoCardProps {
	profile: WorkerProfile | null
	loading?: boolean
	values?: UpdateWorkerProfilePayload
	onChange?: (field: keyof UpdateWorkerProfilePayload, value: string | number | string[]) => void
	skillOptions?: Array<{ value: string; label: string }>
	availabilityOptions?: Array<{ value: string; label: string }>
	occupationOptions?: Array<{ value: string; label: string }>
	languageOptions?: Array<{ value: string; label: string }>
	locationOptions?: Array<{ value: string; label: string }>
	isDirty?: boolean
	saving?: boolean
	onSave?: () => Promise<void>
	onDiscard?: () => void
	focusField?: string
}

export function WorkerInfoCard({ profile, loading = false, values, onChange, skillOptions = [], availabilityOptions = [], occupationOptions = [], languageOptions = [], locationOptions = [], isDirty = false, saving = false, onSave, onDiscard, focusField }: WorkerInfoCardProps) {
	const [selectedSkill, setSelectedSkill] = useState('')
	const [selectedRole, setSelectedRole] = useState('')
	const [selectedLanguage, setSelectedLanguage] = useState('')
	const [detailsModalOpen, setDetailsModalOpen] = useState(false)
	const currentSkills = values?.skills ?? profile?.skills ?? []
	const currentRoles = values?.secondary_roles ?? profile?.secondary_roles ?? []
	const currentLanguages = values?.languages ?? profile?.languages ?? []
	const availableSkillOptions = skillOptions.filter((skill) => !currentSkills.includes(skill.label) && !currentSkills.includes(skill.value))
	const availableRoleOptions = occupationOptions.filter((role) => !currentRoles.includes(role.label) && !currentRoles.includes(role.value))
	const availableLanguageOptions = languageOptions.filter((language) => !currentLanguages.includes(language.label) && !currentLanguages.includes(language.value))
	useEffect(() => {
		if (!detailsModalOpen || !focusField) return
		window.setTimeout(() => document.getElementById(`field-${focusField}`)?.focus(), 0)
	}, [detailsModalOpen, focusField])
	const addSkill = (value: string) => {
		if (!value || currentSkills.includes(value)) return
		const option = skillOptions.find((skill) => skill.value === value)
		onChange?.('skills', [...currentSkills, option?.label ?? value])
		setSelectedSkill('')
	}
	const removeSkill = (skillToRemove: string) => onChange?.('skills', currentSkills.filter((skill) => skill !== skillToRemove))
	const addRole = (value: string) => {
		if (!value || currentRoles.includes(value)) return
		const option = occupationOptions.find((role) => role.value === value)
		onChange?.('secondary_roles', [...currentRoles, option?.label ?? value])
		setSelectedRole('')
	}
	const removeRole = (roleToRemove: string) => onChange?.('secondary_roles', currentRoles.filter((role) => role !== roleToRemove))
	const addLanguage = (value: string) => {
		if (!value || currentLanguages.includes(value)) return
		const option = languageOptions.find((language) => language.value === value)
		onChange?.('languages', [...currentLanguages, option?.label ?? value])
		setSelectedLanguage('')
	}
	const removeLanguage = (languageToRemove: string) => onChange?.('languages', currentLanguages.filter((language) => language !== languageToRemove))
	if (loading) {
		return (
			<FormSection title="Professional details" description="Share the information employers use to assess your fit for roles." icon={<BriefcaseBusiness className="h-4 w-4" />}>
				<div className="grid gap-4 md:grid-cols-2">
					<Skeleton className="h-10" />
					<Skeleton className="h-10" />
					<Skeleton className="h-10" />
					<Skeleton className="h-10" />
					<Skeleton className="h-10" />
					<Skeleton className="h-10" />
				</div>
			</FormSection>
		)
	}

	return (
		<>
			<div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-white via-white to-orange-50/40 p-5 shadow-sm">
				<div className="flex items-center justify-between gap-3 border-b border-orange-100 pb-4">
					<div>
						<h2 className="text-sm font-black text-slate-900">Professional details</h2>
						<p className="mt-0.5 text-xs text-slate-500">Share the information employers use to assess your fit for roles.</p>
					</div>
					<Button id="professional-details-trigger" type="button" variant="outline" size="sm" leftIcon={<Edit3 className="h-3.5 w-3.5" />} onClick={() => setDetailsModalOpen(true)}>Edit details</Button>
				</div>
				<div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:gap-x-6">
					<Detail label="Full name" value={profile?.user.full_name || 'Not available'} />
					<Detail label="Phone number" value={profile?.user.phone || 'Not provided'} />
					<Detail label="Email address" value={values?.email ?? profile?.user.email ?? 'Not provided'} />
					<Detail label="Gender" value={values?.gender || profile?.user.gender || 'Not provided'} capitalize />
					<Detail label="Date of birth" value={values?.date_of_birth || profile?.user.date_of_birth || 'Not provided'} />
					<Detail label="Preferred role" value={values?.primary_role || profile?.primary_role || 'Not provided'} />
					<Detail label="Expected pay rate" value={`KSh ${values?.expected_daily_rate_ksh ?? profile?.expected_daily_rate_ksh ?? 0} per day`} />
					<Detail label="Monthly salary" value={values?.expected_monthly_salary_ksh ? `KSh ${values.expected_monthly_salary_ksh}` : 'Not provided'} />
					<Detail label="Location" value={values?.location || profile?.location || 'Not provided'} />
					<Detail label="Availability" value={(values?.availability || profile?.availability || 'immediate').replace(/_/g, ' ')} capitalize />
					<Detail label="Years of experience" value={`${values?.years_of_experience ?? profile?.years_of_experience ?? 0} years`} />
					<Detail label="Last employer" value={values?.last_employer || profile?.last_employer || 'Not provided'} />
				</div>
				<div className="mt-5 border-t border-slate-100 pt-4">
					<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Bio</p>
					<p className="mt-2 text-sm leading-relaxed text-slate-700">{values?.bio || profile?.bio || 'No professional summary provided yet.'}</p>
				</div>
				{(currentRoles.length > 0 || currentSkills.length > 0 || currentLanguages.length > 0) && <div className="mt-5 border-t border-slate-100 pt-4 space-y-3">
					{currentRoles.length > 0 && <SummaryChips label="Secondary roles" items={currentRoles} color="blue" />}
					{currentSkills.length > 0 && <SummaryChips label="Skills" items={currentSkills} color="orange" />}
					{currentLanguages.length > 0 && <SummaryChips label="Languages" items={currentLanguages} color="blue" />}
				</div>}
			</div>
			<Modal isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} title="Professional details" subtitle="Share the information employers use to assess your fit for roles." maxWidth="2xl">
			<FormSection divider={false} title="Professional details" description="Update the details employers use to assess your fit for roles." icon={<BriefcaseBusiness className="h-4 w-4" />}>
			<div className="grid gap-4 md:grid-cols-2">
				<FormField label="Full name" required>
					<Input value={profile?.user.full_name || 'Not available'} readOnly className="cursor-not-allowed bg-slate-100 text-slate-500" />
				</FormField>
				<FormField label="Phone number" required>
					<Input value={profile?.user.phone || 'Not provided'} readOnly className="cursor-not-allowed bg-slate-100 text-slate-500" />
				</FormField>
				<FormField label="Email address" required>
					<Input type="email" value={values?.email ?? profile?.user.email ?? ''} onChange={(event) => onChange?.('email', event.target.value)} placeholder="you@example.com" readOnly={!onChange} />
				</FormField>
				<FormField label="Gender">
					<Select value={values?.gender ?? profile?.user.gender ?? ''} onChange={(value) => onChange?.('gender', value)} options={[{ value: '', label: 'Select gender' }, { value: 'female', label: 'Female' }, { value: 'male', label: 'Male' }, { value: 'non_binary', label: 'Non-binary' }, { value: 'prefer_not_to_say', label: 'Prefer not to say' }]} disabled={!onChange} />
				</FormField>
				<FormField label="Date of birth">
					<DatePicker value={values?.date_of_birth ?? profile?.user.date_of_birth ?? ''} onChange={(value) => onChange?.('date_of_birth', value)} maxDate={getAdultDateOfBirthMax()} quickPresets={false} disabled={!onChange} />
				</FormField>
				<FormField label="Preferred role">
					<Input id="field-role_rate" value={values?.primary_role ?? profile?.primary_role ?? ''} onChange={(event) => onChange?.('primary_role', event.target.value)} placeholder="Preferred role" readOnly={!onChange} />
				</FormField>
				<FormField label="Expected pay rate">
					<Input type="number" min="0" value={values?.expected_daily_rate_ksh ?? profile?.expected_daily_rate_ksh ?? ''} onChange={(event) => onChange?.('expected_daily_rate_ksh', Number(event.target.value))} placeholder="Daily rate in KSh" readOnly={!onChange} />
				</FormField>
				<FormField label="Expected monthly salary">
					<Input type="number" min="0" value={values?.expected_monthly_salary_ksh ?? profile?.expected_monthly_salary_ksh ?? ''} onChange={(event) => onChange?.('expected_monthly_salary_ksh', Number(event.target.value))} placeholder="Monthly salary in KSh" readOnly={!onChange} />
				</FormField>
				<FormField label="Location">
					{onChange ? <Select searchable value={values?.location ?? profile?.location ?? ''} onChange={(value) => onChange('location', value)} options={[{ value: '', label: 'Select location' }, ...locationOptions]} /> : <Input value={profile?.location ?? ''} readOnly className="cursor-not-allowed bg-slate-100 text-slate-500" />}
				</FormField>
				<FormField label="Availability">
					<Select searchable value={values?.availability ?? profile?.availability ?? ''} onChange={(value) => onChange?.('availability', value as WorkerAvailability)} options={[{ value: '', label: 'Select availability' }, ...availabilityOptions]} disabled={!onChange} />
				</FormField>
				<FormField label="Years of experience">
					<Input type="number" min="0" value={values?.years_of_experience ?? profile?.years_of_experience ?? ''} onChange={(event) => onChange?.('years_of_experience', Number(event.target.value))} placeholder="Years" readOnly={!onChange} />
				</FormField>
				<FormField label="Last employer">
					<Input value={values?.last_employer ?? profile?.last_employer ?? ''} onChange={(event) => onChange?.('last_employer', event.target.value)} placeholder="Last employer" readOnly={!onChange} />
					</FormField>
					<FormField label="Secondary roles" helperText="Choose other roles you can perform.">
						{onChange && <Select searchable value={selectedRole} onChange={addRole} options={[{ value: '', label: 'Add a secondary role' }, ...availableRoleOptions]} />}
						<div className="mt-2 flex flex-wrap gap-2">{currentRoles.map((role) => <Chip key={role} color="blue" onRemove={onChange ? () => removeRole(role) : undefined} removeLabel={`Remove ${role}`}>{role}</Chip>)}</div>
					</FormField>
					<FormField label="Skills" helperText="Choose skills from the searchable suggestions.">
						{onChange && <Select searchable value={selectedSkill} onChange={addSkill} options={[{ value: '', label: 'Add a skill' }, ...availableSkillOptions]} />}
						<div className="mt-2 flex flex-wrap gap-2">
							{currentSkills.map((skill) => <Chip key={skill} color="orange" onRemove={onChange ? () => removeSkill(skill) : undefined} removeLabel={`Remove ${skill}`}>{skill}</Chip>)}
						</div>
					</FormField>
					<FormField label="Languages" helperText="Choose languages from the searchable suggestions.">
						{onChange && <Select searchable value={selectedLanguage} onChange={addLanguage} options={[{ value: '', label: 'Add a language' }, ...availableLanguageOptions]} />}
						<div className="mt-2 flex flex-wrap gap-2">{currentLanguages.map((language) => <Chip key={language} color="blue" onRemove={onChange ? () => removeLanguage(language) : undefined} removeLabel={`Remove ${language}`}>{language}</Chip>)}</div>
				</FormField>
			</div>
				<FormField label="Bio">
					<div>
						<textarea maxLength={500} value={values?.bio ?? profile?.bio ?? ''} onChange={(event) => onChange?.('bio', event.target.value)} rows={4} placeholder="Tell employers about your experience and strengths." readOnly={!onChange} className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-[#FF6B00] focus:bg-white" />
						<p className="mt-1 text-right text-xs text-slate-500">{(values?.bio ?? profile?.bio ?? '').length}/500</p>
					</div>
				</FormField>
			</FormSection>
			<div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
				<span className="text-xs font-semibold text-slate-500">{isDirty ? 'Unsaved changes to your profile' : 'All profile details saved'}</span>
				<div className="flex gap-2">
					{isDirty && <Button type="button" variant="outline" size="sm" onClick={onDiscard} disabled={saving}>Discard</Button>}
					<Button type="button" size="sm" onClick={() => void onSave?.()} disabled={saving || !isDirty} isLoading={saving}>{saving ? 'Saving profile...' : 'Save profile'}</Button>
				</div>
			</div>
			</Modal>
		</>
	)
}

function Detail({ label, value, capitalize = false }: { label: string; value: string; capitalize?: boolean }) {
	return <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p><p className={`mt-1 text-sm font-semibold text-slate-800 ${capitalize ? 'capitalize' : ''}`}>{value}</p></div>
}

function SummaryChips({ label, items, color }: { label: string; items: string[]; color: 'blue' | 'orange' }) {
	return <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p><div className="mt-2 flex flex-wrap gap-2">{items.map((item) => <Chip key={item} color={color}>{item}</Chip>)}</div></div>
}
