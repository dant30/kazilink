// frontend/src/features/admin/components/AdminStat.tsx
import type { ReactNode } from 'react'
import { StatCard } from '../../../shared/components/cards/StatCard'

interface AdminStatProps {
	label: string
	value: string | number
	description: string
	icon: ReactNode
}

export function AdminStat({ label, value, description, icon }: AdminStatProps) {
	return <StatCard title={label} value={value} subtitle={description} icon={icon} iconBg="bg-orange-50 text-[#FF6B00]" />
}