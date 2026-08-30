// frontend/src/features/admin/components/AdminStat.tsx
import type { ReactNode } from 'react'

interface AdminStatProps {
	label: string
	value: string | number
	description: string
	icon: ReactNode
}

export function AdminStat({ label, value, description, icon }: AdminStatProps) {
	return (
		<article className="card-kazilink flex items-start justify-between gap-4 p-5">
			<div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p><strong className="mt-3 block font-display text-3xl font-black text-[#0A2540]">{value}</strong><p className="mt-1 text-xs text-slate-500">{description}</p></div>
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-[#FF6B00]">{icon}</div>
		</article>
	)
}