// frontend/src/features/admin/pages/AdminDashboardPage.tsx
import { AlertTriangle, ArrowRight, Briefcase, FileCheck, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { AdminStat } from '../components'
import { useAdminUsers } from '../hooks'
import { useJobs } from '../../jobs/hooks'
import { useEstablishments } from '../../establishments/hooks'
import { useVerificationQueue } from '../../employment_history/hooks'

const managementLinks = [
	['/admin/users', 'Manage users', 'Review worker and employer accounts', Users],
	['/admin/jobs', 'Review job postings', 'Monitor marketplace listings', Briefcase],
	['/admin/employment-history', 'Verify employment history', 'Process reference checks', FileCheck],
	['/admin/fraud', 'Review fraud alerts', 'Keep the network trustworthy', AlertTriangle],
] as const

export function AdminDashboardPage() {
	const { users } = useAdminUsers()
	const { jobs } = useJobs({})
	const { establishments } = useEstablishments()
	const { records: verificationQueue } = useVerificationQueue()
	return (
		<section className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
			<PageHeader
				title="Keep KaziLink reliable."
				description="Manage users, verify work histories, monitor jobs, and respond to marketplace risks from one operational workspace."
				actions={
					<span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
						<ShieldCheck className="h-4 w-4 text-[#FF6B00]" />
						Admin Trust & Operations Desk
					</span>
				}
			/>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"><AdminStat label="Users" value={users.length} description="Worker and employer accounts" icon={<Users className="h-5 w-5" />} /><AdminStat label="Open jobs" value={jobs.filter((job) => job.status === 'open').length} description="Currently active listings" icon={<Briefcase className="h-5 w-5" />} /><AdminStat label="Verification queue" value={verificationQueue.filter((record) => record.verification_status === 'pending').length} description="Employment records awaiting review" icon={<FileCheck className="h-5 w-5" />} /><AdminStat label="Establishments" value={establishments.length} description="Venues tracked on the platform" icon={<AlertTriangle className="h-5 w-5" />} /></div>
			<div className="card-kazilink space-y-4 p-6"><div><h2 className="font-display text-lg font-bold text-slate-900">Administration shortcuts</h2><p className="text-xs text-slate-500">Choose an area to continue managing the marketplace</p></div><div className="grid gap-3 sm:grid-cols-2">{managementLinks.map(([path, title, description, Icon]) => <Link key={path} to={path} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-orange-50"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0A2540] text-white"><Icon className="h-4 w-4" /></span><span className="flex-1"><strong className="block text-sm text-slate-900">{title}</strong><span className="text-xs text-slate-500">{description}</span></span><ArrowRight className="h-4 w-4 text-[#FF6B00]" /></Link>)}</div></div>
		</section>
	)
}