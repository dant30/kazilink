// frontend/src/features/workers/components/WorkerStatsCard.tsx
import type { WorkerProfile } from '../types'

interface WorkerStatsCardProps {
	profile: WorkerProfile | null
	loading?: boolean
}

export function WorkerStatsCard({ profile, loading = false }: WorkerStatsCardProps) {
	if (loading) {
		return (
			<div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
				<div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
				<div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
					<div className="h-20 bg-white rounded animate-pulse" />
					<div className="h-20 bg-white rounded animate-pulse" />
				</div>
			</div>
		)
	}

	return (
		<div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
			<h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">Quick stats</h3>
			<div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
				<div className="rounded-xl bg-white p-3">
					<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Applications</p>
					<p className="mt-1 text-2xl font-black text-[#0A2540]">{profile?.reviews_count ?? 0}</p>
				</div>
				<div className="rounded-xl bg-white p-3">
					<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Accepted shifts</p>
					<p className="mt-1 text-2xl font-black text-[#0A2540]">{profile?.jobs_completed ?? 0}</p>
				</div>
			</div>
		</div>
	)
}
