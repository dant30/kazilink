// frontend/src/features/workers/components/WorkerStatusCard.tsx
import { CheckCircle2, Clock3, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { WorkerProfile } from '../types'
import { Badge } from '../../../shared/components/ui/Badge'
import { Switch } from '../../../shared/components/ui/Switch'

interface WorkerStatusCardProps {
	profile: WorkerProfile | null
	loading?: boolean
	onStatusChange?: (field: 'open_to_work', value: boolean) => void
}

export function WorkerStatusCard({ profile, loading = false, onStatusChange }: WorkerStatusCardProps) {
	const [openToWork, setOpenToWork] = useState(profile?.open_to_work ?? true)
	const [backgroundCheck, setBackgroundCheck] = useState(profile?.background_check_verified ?? false)

	useEffect(() => {
		if (!profile) return
		setOpenToWork(profile.open_to_work)
		setBackgroundCheck(profile.background_check_verified)
	}, [profile])

	const handleOpenToWorkChange = (value: boolean) => {
		setOpenToWork(value)
		onStatusChange?.('open_to_work', value)
	}

	if (loading) {
		return (
			<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
				<div className="flex items-center justify-between gap-3">
					<div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
					<div className="h-6 w-12 bg-slate-200 rounded animate-pulse" />
				</div>
				<div className="mt-5 space-y-4">
					<div className="h-10 bg-slate-100 rounded animate-pulse" />
					<div className="h-10 bg-slate-100 rounded animate-pulse" />
					<div className="h-10 bg-slate-100 rounded animate-pulse" />
				</div>
			</div>
		)
	}

	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
			<div className="flex items-center justify-between gap-3">
				<h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">Status</h3>
				<Badge variant="success" icon={<CheckCircle2 className="h-3 w-3" />}>
					Verified
				</Badge>
			</div>
			<div className="mt-5 space-y-4">
				<div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
					<div className="flex items-center gap-2 text-sm font-medium text-slate-700">
						<Clock3 className="h-4 w-4 text-[#FF6B00]" />
						Open to work
					</div>
					<Switch checked={openToWork} onChange={handleOpenToWorkChange} size="sm" />
				</div>
				<div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
					<div className="flex items-center gap-2 text-sm font-medium text-slate-700">
						<Star className="h-4 w-4 text-[#FF6B00]" />
						Background check
					</div>
					<Switch checked={backgroundCheck} onChange={() => undefined} size="sm" disabled />
				</div>
			</div>
		</div>
	)
}
