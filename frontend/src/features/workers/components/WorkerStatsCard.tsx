// frontend/src/features/workers/components/WorkerStatsCard.tsx
import type { WorkerProfile } from '../types'
import { Badge } from '../../../shared/components/ui/Badge'
import { Skeleton } from '../../../shared/components/ui/Skeleton'

interface WorkerStatsCardProps {
	profile: WorkerProfile | null
	loading?: boolean
}

export function WorkerStatsCard({ profile, loading = false }: WorkerStatsCardProps) {
	if (loading) {
		return (
			<div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
				<Skeleton className="h-4 w-24" />
				<div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
					<Skeleton className="h-20 rounded-xl" />
					<Skeleton className="h-20 rounded-xl" />
				</div>
			</div>
		)
	}

	return (
		<div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
			<h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">Quick stats</h3>
			<div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
				<div className="rounded-xl bg-white p-3">
					<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Rating</p>
					<p className="mt-1 text-2xl font-black text-[#0A2540]">{Number(profile?.rating ?? 0).toFixed(1)} <span className="text-xs font-semibold text-slate-400">/ 5</span></p>
					<Badge variant="orange" size="sm" className="mt-2">{profile?.reviews_count ?? 0} reviews</Badge>
				</div>
				<div className="rounded-xl bg-white p-3">
					<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Jobs completed</p>
					<p className="mt-1 text-2xl font-black text-[#0A2540]">{profile?.jobs_completed ?? 0}</p>
				</div>
				<div className="rounded-xl bg-white p-3"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Punctuality</p><p className="mt-1 text-2xl font-black text-[#0A2540]">{profile?.punctuality_score ?? 0}%</p></div>
				<div className="rounded-xl bg-white p-3"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Response time</p><p className="mt-1 text-2xl font-black text-[#0A2540]">{profile?.response_time_minutes ? `${profile.response_time_minutes}m` : 'N/A'}</p></div>
			</div>
		</div>
	)
}
