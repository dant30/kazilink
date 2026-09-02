// frontend/src/features/workers/components/WorkerInfoCard.tsx
import { BriefcaseBusiness } from 'lucide-react'
import type { WorkerProfile } from '../types'
import { FormField, FormSection } from '../../../shared/components/forms'
import { Input } from '../../../shared/components/ui/Input'
import { Select } from '../../../shared/components/ui/Select'

interface WorkerInfoCardProps {
	profile: WorkerProfile | null
	loading?: boolean
}

export function WorkerInfoCard({ profile, loading = false }: WorkerInfoCardProps) {
	if (loading) {
		return (
			<FormSection title="Professional details" description="Share the information employers use to assess your fit for roles." icon={<BriefcaseBusiness className="h-4 w-4" />}>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="h-10 bg-slate-200 rounded animate-pulse" />
					<div className="h-10 bg-slate-200 rounded animate-pulse" />
					<div className="h-10 bg-slate-200 rounded animate-pulse" />
					<div className="h-10 bg-slate-200 rounded animate-pulse" />
					<div className="h-10 bg-slate-200 rounded animate-pulse" />
					<div className="h-10 bg-slate-200 rounded animate-pulse" />
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
					<Input value={profile?.primary_role || 'Not set'} readOnly />
				</FormField>
				<FormField label="Expected pay rate">
					<Input value={profile ? `KSh ${profile.expected_daily_rate_ksh} / shift` : 'Not set'} readOnly />
				</FormField>
				<FormField label="Location">
					<Input value={profile?.location || 'Not set'} readOnly />
				</FormField>
				<FormField label="Availability">
					<Input
						value={
							profile
								? {
										immediate: 'Immediate',
										night_shifts: 'Night shifts',
										full_time: 'Full time',
										part_time: 'Part time',
									}[profile.availability]
								: 'Not set'
						}
						readOnly
					/>
				</FormField>
				<FormField label="Years of experience">
					<Input value={profile?.years_of_experience ?? 'Not set'} readOnly />
				</FormField>
				<FormField label="Last employer">
					<Input value={profile?.last_employer || 'Not provided'} readOnly />
				</FormField>
			</div>
		</FormSection>
	)
}
