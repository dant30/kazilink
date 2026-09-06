// frontend/src/features/workers/components/WorkerInfoCard.tsx
import { BriefcaseBusiness, X } from 'lucide-react'
import { useState } from 'react'
import type { UpdateWorkerProfilePayload, WorkerAvailability, WorkerProfile } from '../types'
import { FormField, FormSection } from '../../../shared/components/forms'
import { Input } from '../../../shared/components/ui/Input'
import { Select } from '../../../shared/components/ui/Select'
import { Skeleton } from '../../../shared/components/ui/Skeleton'

interface WorkerInfoCardProps {
	profile: WorkerProfile | null
	loading?: boolean
	values?: UpdateWorkerProfilePayload
	onChange?: (field: keyof UpdateWorkerProfilePayload, value: string | number | string[]) => void
	skillOptions?: Array<{ value: string; label: string }>
	availabilityOptions?: Array<{ value: string; label: string }>
	occupationOptions?: Array<{ value: string; label: string }>
}

export function WorkerInfoCard({ profile, loading = false, values, onChange, skillOptions = [], availabilityOptions = [], occupationOptions = [] }: WorkerInfoCardProps) {
	const [selectedSkill, setSelectedSkill] = useState('')
	const [selectedRole, setSelectedRole] = useState('')
	const currentSkills = values?.skills ?? profile?.skills ?? []
	const currentRoles = values?.secondary_roles ?? profile?.secondary_roles ?? []
	const availableSkillOptions = skillOptions.filter((skill) => !currentSkills.includes(skill.label) && !currentSkills.includes(skill.value))
	const availableRoleOptions = occupationOptions.filter((role) => !currentRoles.includes(role.label) && !currentRoles.includes(role.value))
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
		<FormSection title="Professional details" description="Share the information employers use to assess your fit for roles." icon={<BriefcaseBusiness className="h-4 w-4" />}>
			<div className="grid gap-4 md:grid-cols-2">
				<FormField label="Full name" required>
					<Input value={profile?.user.full_name || 'Not available'} readOnly className="cursor-not-allowed bg-slate-100 text-slate-500" />
				</FormField>
				<FormField label="Phone number" required>
					<Input value={profile?.user.phone || 'Not provided'} readOnly className="cursor-not-allowed bg-slate-100 text-slate-500" />
				</FormField>
				<FormField label="Preferred role">
					<Input value={values?.primary_role ?? profile?.primary_role ?? ''} onChange={(event) => onChange?.('primary_role', event.target.value)} placeholder="Preferred role" readOnly={!onChange} />
				</FormField>
				<FormField label="Expected pay rate">
					<Input type="number" min="0" value={values?.expected_daily_rate_ksh ?? profile?.expected_daily_rate_ksh ?? ''} onChange={(event) => onChange?.('expected_daily_rate_ksh', Number(event.target.value))} placeholder="Daily rate in KSh" readOnly={!onChange} />
				</FormField>
				<FormField label="Expected monthly salary">
					<Input type="number" min="0" value={values?.expected_monthly_salary_ksh ?? profile?.expected_monthly_salary_ksh ?? ''} onChange={(event) => onChange?.('expected_monthly_salary_ksh', Number(event.target.value))} placeholder="Monthly salary in KSh" readOnly={!onChange} />
				</FormField>
				<FormField label="Location">
					<Input value={values?.location ?? profile?.location ?? ''} onChange={(event) => onChange?.('location', event.target.value)} placeholder="Location" readOnly={!onChange} />
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
						<div className="mt-2 flex flex-wrap gap-2">{currentRoles.map((role) => <span key={role} className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">{role}{onChange && <button type="button" onClick={() => removeRole(role)} className="rounded-full p-0.5 hover:bg-blue-200" aria-label={`Remove ${role}`}><X className="h-3 w-3" /></button>}</span>)}</div>
					</FormField>
					<FormField label="Skills" helperText="Choose skills from the searchable suggestions.">
						{onChange && <Select searchable value={selectedSkill} onChange={addSkill} options={[{ value: '', label: 'Add a skill' }, ...availableSkillOptions]} />}
						<div className="mt-2 flex flex-wrap gap-2">
							{currentSkills.map((skill) => <span key={skill} className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-800">{skill}{onChange && <button type="button" onClick={() => removeSkill(skill)} className="rounded-full p-0.5 hover:bg-orange-200" aria-label={`Remove ${skill}`}><X className="h-3 w-3" /></button>}</span>)}
						</div>
					</FormField>
					<FormField label="Languages" helperText="Separate languages with commas.">
						<Input value={values?.languages?.join(', ') ?? profile?.languages.join(', ') ?? ''} onChange={(event) => onChange?.('languages', event.target.value.split(',').map((language) => language.trim()).filter(Boolean))} placeholder="English, Kiswahili" readOnly={!onChange} />
				</FormField>
			</div>
				<FormField label="Bio">
					<div>
						<textarea maxLength={500} value={values?.bio ?? profile?.bio ?? ''} onChange={(event) => onChange?.('bio', event.target.value)} rows={4} placeholder="Tell employers about your experience and strengths." readOnly={!onChange} className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-[#FF6B00] focus:bg-white" />
						<p className="mt-1 text-right text-xs text-slate-500">{(values?.bio ?? profile?.bio ?? '').length}/500</p>
					</div>
				</FormField>
		</FormSection>
	)
}
