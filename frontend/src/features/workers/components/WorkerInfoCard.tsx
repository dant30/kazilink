// frontend/src/features/workers/components/WorkerInfoCard.tsx
import { BriefcaseBusiness } from 'lucide-react'
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
}

export function WorkerInfoCard({ profile, loading = false, values, onChange, skillOptions = [] }: WorkerInfoCardProps) {
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
					<Input value={profile?.user.full_name || 'Not available'} readOnly />
				</FormField>
				<FormField label="Phone number" required>
					<Input value={profile?.user.phone || 'Not provided'} readOnly />
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
					<Select value={values?.availability ?? profile?.availability ?? ''} onChange={(value) => onChange?.('availability', value as WorkerAvailability)} options={[{ value: '', label: 'Select availability' }, { value: 'immediate', label: 'Immediate' }, { value: 'night_shifts', label: 'Night shifts' }, { value: 'full_time', label: 'Full time' }, { value: 'part_time', label: 'Part time' }]} disabled={!onChange} />
				</FormField>
				<FormField label="Years of experience">
					<Input type="number" min="0" value={values?.years_of_experience ?? profile?.years_of_experience ?? ''} onChange={(event) => onChange?.('years_of_experience', Number(event.target.value))} placeholder="Years" readOnly={!onChange} />
				</FormField>
				<FormField label="Last employer">
					<Input value={values?.last_employer ?? profile?.last_employer ?? ''} onChange={(event) => onChange?.('last_employer', event.target.value)} placeholder="Last employer" readOnly={!onChange} />
					</FormField>
					<FormField label="Secondary roles" helperText="Separate roles with commas.">
						<Input value={values?.secondary_roles?.join(', ') ?? profile?.secondary_roles.join(', ') ?? ''} onChange={(event) => onChange?.('secondary_roles', event.target.value.split(',').map((role) => role.trim()).filter(Boolean))} placeholder="Waiter, bartender" readOnly={!onChange} />
					</FormField>
					<FormField label="Skills" helperText="Separate skills with commas.">
						<Input list="worker-skill-suggestions" value={values?.skills?.join(', ') ?? profile?.skills.join(', ') ?? ''} onChange={(event) => onChange?.('skills', event.target.value.split(',').map((skill) => skill.trim()).filter(Boolean))} placeholder="Food service, barista" readOnly={!onChange} />
						<datalist id="worker-skill-suggestions">{skillOptions.map((skill) => <option key={skill.value} value={skill.label} />)}</datalist>
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
