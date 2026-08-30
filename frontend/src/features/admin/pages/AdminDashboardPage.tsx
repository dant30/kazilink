// frontend/src/features/admin/pages/AdminDashboardPage.tsx
import { AlertTriangle, ArrowRight, Briefcase, FileCheck, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AdminStat } from '../components'

const managementLinks = [
	['/admin/users', 'Manage users', 'Review worker and employer accounts', Users],
	['/admin/jobs', 'Review job postings', 'Monitor marketplace listings', Briefcase],
	['/admin/employment-history', 'Verify employment history', 'Process reference checks', FileCheck],
	['/admin/fraud', 'Review fraud alerts', 'Keep the network trustworthy', AlertTriangle],
] as const

export function AdminDashboardPage() {
	return (
		<section className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
			<header className="rounded-2xl bg-gradient-to-r from-[#0A2540] via-[#153B64] to-[#0E2E4E] p-6 text-white shadow-sm sm:p-8"><div className="max-w-2xl space-y-3"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold"><ShieldCheck className="h-4 w-4 text-[#FF6B00]" /> Admin Trust & Operations Desk</span><h1 className="font-display text-2xl font-black text-white sm:text-4xl">Keep KaziLink reliable.</h1><p className="text-sm leading-relaxed text-slate-200 sm:text-base">Manage users, verify work histories, monitor jobs, and respond to marketplace risks from one operational workspace.</p></div></header>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"><AdminStat label="Users" value="Manage" description="Worker and employer accounts" icon={<Users className="h-5 w-5" />} /><AdminStat label="Job postings" value="Review" description="Open and reported listings" icon={<Briefcase className="h-5 w-5" />} /><AdminStat label="Verification" value="Queue" description="Employment records to audit" icon={<FileCheck className="h-5 w-5" />} /><AdminStat label="Trust alerts" value="Monitor" description="Fraud and support signals" icon={<AlertTriangle className="h-5 w-5" />} /></div>
			<div className="card-kazilink space-y-4 p-6"><div><h2 className="font-display text-lg font-bold text-slate-900">Administration shortcuts</h2><p className="text-xs text-slate-500">Choose an area to continue managing the marketplace</p></div><div className="grid gap-3 sm:grid-cols-2">{managementLinks.map(([path, title, description, Icon]) => <Link key={path} to={path} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-orange-50"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0A2540] text-white"><Icon className="h-4 w-4" /></span><span className="flex-1"><strong className="block text-sm text-slate-900">{title}</strong><span className="text-xs text-slate-500">{description}</span></span><ArrowRight className="h-4 w-4 text-[#FF6B00]" /></Link>)}</div></div>
		</section>
	)
}