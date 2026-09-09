// frontend/src/features/workers/components/WorkerStatsCard.tsx
import type { WorkerProfile } from '../types'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { StatCard } from '../../../shared/components/cards/StatCard'
import { BriefcaseBusiness, Clock3, Timer } from 'lucide-react'

interface WorkerStatsCardProps {
	profile: WorkerProfile | null
	loading?: boolean
}

export function WorkerStatsCard({ profile, loading = false }: WorkerStatsCardProps) {
	if (loading) {
		return (
			<div className="grid grid-cols-3 gap-3 sm:gap-4">
				<Skeleton className="h-28 rounded-2xl" />
				<Skeleton className="h-28 rounded-2xl" />
				<Skeleton className="h-28 rounded-2xl" />
			</div>
		)
	}

	return (
		<div className="grid grid-cols-3 gap-3 sm:gap-4">
			<StatCard title="Jobs completed" value={profile?.jobs_completed ?? 0} subtitle="Hires on your profile" icon={<BriefcaseBusiness className="h-4 w-4" />} iconBg="bg-orange-50 text-[#FF6B00]" />
			<StatCard title="Punctuality" value={`${profile?.punctuality_score ?? 0}%`} subtitle="Attendance record" icon={<Clock3 className="h-4 w-4" />} iconBg="bg-emerald-50 text-emerald-600" />
			<StatCard title="Response time" value={profile?.response_time_minutes ? `${profile.response_time_minutes}m` : 'N/A'} subtitle="Employer replies" icon={<Timer className="h-4 w-4" />} iconBg="bg-blue-50 text-blue-600" />
		</div>
	)
}
