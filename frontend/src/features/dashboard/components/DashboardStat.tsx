// frontend/src/features/dashboard/components/DashboardStat.tsx
import type { ReactNode } from 'react'

export interface DashboardStatProps {
	label: string
	value: string | number
	description: string
	icon?: ReactNode
	accent?: 'orange' | 'navy' | 'amber' | 'emerald'
}

const accents = {
	orange: 'text-[#FF6B00] bg-orange-50 border-orange-100',
	navy: 'text-[#0A2540] bg-slate-100 border-slate-200',
	amber: 'text-amber-600 bg-amber-50 border-amber-100',
	emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
}

export function DashboardStat({ label, value, description, icon, accent = 'orange' }: DashboardStatProps) {
	return (
		<article className="card-kazilink flex flex-col justify-between p-5 transition-shadow hover:shadow-md">
			<div className="flex items-start justify-between gap-3">
				<span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
				{icon && <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${accents[accent]}`}>{icon}</div>}
			</div>
			<div className="mt-5"><strong className="font-display text-2xl font-black tracking-tight text-[#0A2540] sm:text-3xl">{value}</strong><p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p></div>
		</article>
	)
}