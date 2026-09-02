// frontend/src/features/workers/pages/WorkerProfilePage.tsx
import { Avatar } from '../../../shared/components/ui/Avatar'
import { Badge } from '../../../shared/components/ui/Badge'
import { Button } from '../../../shared/components/ui/Button'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { useAuthStore } from '../../auth/store'
import { useWorkerProfile } from '../hooks/useWorkerProfile'
import { useUpdateWorkerProfile } from '../hooks/useUpdateWorkerProfile'
import { WorkerInfoCard, WorkerStatusCard, WorkerStatsCard } from '../components'
import { FormSection } from '../../../shared/components/forms'

export function WorkerProfilePage() {
	const { user } = useAuthStore()
	const { profile, loading, error, refresh } = useWorkerProfile()
	const { updating, error: updateError, success, updateProfile, clearError } = useUpdateWorkerProfile()
	const profileStrength = profile
		? Math.round(
				([profile.primary_role, profile.location, profile.bio, profile.skills.length > 0, profile.languages.length > 0, profile.last_employer]
					.filter(Boolean).length /
					6) *
				100
			)
		: 0

	const handleStatusChange = async (field: 'open_to_work', value: boolean) => {
		try {
			clearError()
			await updateProfile({ [field]: value })
		} catch (err) {
			console.error('Failed to update status:', err)
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

	return (
		<section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
			<PageHeader
				eyebrow="Worker profile"
				title={user?.full_name || 'Your profile'}
				actions={
					<div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-left backdrop-blur-sm">
						<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">Profile strength</p>
						<div className="mt-2 flex items-center gap-3">
							<span className="text-3xl font-black text-white">{profileStrength}%</span>
							<div className="h-2.5 w-24 rounded-full bg-white/15">
								<div className="h-2.5 rounded-full bg-[#FF6B00]" style={{ width: `${profileStrength}%` }} />
							</div>
						</div>
					</div>
				}
			>
				<div className="mt-3 flex flex-wrap gap-2">
					<Badge variant="verified">Verified</Badge>
					{profile?.open_to_work && <Badge variant="success">Available for work</Badge>}
				</div>
			</PageHeader>

			{/* Success Message */}
			{success && (
				<div className="rounded-2xl border border-green-200 bg-green-50 p-4">
					<p className="text-green-700 font-semibold">Profile updated successfully!</p>
				</div>
			)}

			{/* Error Message */}
			{updateError && (
				<div className="rounded-2xl border border-red-200 bg-red-50 p-4">
					<p className="text-red-700 font-semibold">{updateError}</p>
				</div>
			)}

			<div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
				<div className="space-y-6">
					{/* Professional Details */}
					<WorkerInfoCard profile={profile} loading={loading} />

					{/* Experience & Skills */}
					<FormSection title="Experience & skills" description="Highlight the strengths employers can validate quickly.">
						<div className="space-y-4">
							{/* Skills */}
							{profile?.skills && profile.skills.length > 0 && (
								<div className="flex flex-wrap gap-2">
								{profile.skills.map((skill: string) => (
										<span key={skill} className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
											{skill}
										</span>
									))}
								</div>
							)}

							{/* Languages */}
							{profile?.languages && profile.languages.length > 0 && (
								<div>
									<p className="text-sm font-semibold text-slate-700 mb-2">Languages</p>
									<div className="flex flex-wrap gap-2">
									{profile.languages.map((lang: string) => (
											<span key={lang} className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
												{lang}
											</span>
										))}
									</div>
								</div>
							)}

							{/* Bio */}
							{profile?.bio && (
								<div className="rounded-xl bg-slate-50 p-4">
									<p className="text-sm text-slate-700">{profile.bio}</p>
								</div>
							)}
						</div>
					</FormSection>
				</div>

				{/* Sidebar */}
				<aside className="space-y-6">
					{/* Status Card */}
					<WorkerStatusCard profile={profile} loading={loading} onStatusChange={handleStatusChange} />

					{/* Stats Card */}
					<WorkerStatsCard profile={profile} loading={loading} />
				</aside>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-end rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
				<Button type="button" disabled={updating || loading} onClick={() => refresh()}>
					{loading ? 'Refreshing...' : 'Refresh profile'}
				</Button>
			</div>
		</section>
	)
}

