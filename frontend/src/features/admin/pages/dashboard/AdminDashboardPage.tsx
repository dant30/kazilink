// frontend/src/features/admin/pages/AdminDashboardPage.tsx
import { AlertTriangle, ArrowRight, Briefcase, Building2, CheckCircle2, CircleDollarSign, FileCheck, Headphones, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { BarChart } from '../../../../shared/components/charts/BarChart'
import { PieChart } from '../../../../shared/components/charts/PieChart'
import { EmptyState } from '../../../../shared/components/feedback'
import { StatCard } from '../../../../shared/components/cards/StatCard'
import { DataTable } from '../../../../shared/components/tables/DataTable'
import { Badge } from '../../../../shared/components/ui/Badge'
import { PageHeader } from '../../../../shared/components/ui/PageHeader'
import { AdminStat } from '../../components'
import { useAdminApplications, useAdminPayments, useAdminSupport, useAdminUsers } from '../../hooks'
import { useJobs } from '../../../jobs/hooks'
import { useEstablishments } from '../../../establishments/hooks'
import { useVerificationQueue } from '../../../employment_history/hooks'
import { useAuthStore } from '../../../auth'
import { getTimeGreeting } from '../../../../core/utils'

const managementLinks = [
	['/admin/users', 'Manage users', 'Review worker and employer accounts', Users],
	['/admin/jobs', 'Review job postings', 'Monitor marketplace listings', Briefcase],
	['/admin/employment-history', 'Verify employment history', 'Process reference checks', FileCheck],
	['/admin/fraud', 'Review fraud alerts', 'Keep the network trustworthy', AlertTriangle],
] as const

export function AdminDashboardPage() {
	const { user } = useAuthStore()
	const { users } = useAdminUsers()
	const { jobs } = useJobs({})
	const { establishments } = useEstablishments()
	const { records: verificationQueue } = useVerificationQueue()
	const { applications } = useAdminApplications()
	const { transactions } = useAdminPayments()
	const { tickets } = useAdminSupport()
	const openJobs = jobs.filter((job) => job.status === 'open').length
	const pendingVerification = verificationQueue.filter((record) => record.verification_status === 'pending').length
	const hiredApplications = applications.filter((application) => application.status === 'hired').length
	const openTickets = tickets.filter((ticket) => ['open', 'in_progress'].includes(ticket.status)).length
	const completedPayments = transactions.filter((transaction) => transaction.status === 'completed').length
	const workerUsers = users.filter((item) => item.is_worker).length
	const employerUsers = users.filter((item) => item.is_employer).length
	const recentJobs = jobs.slice(0, 5)
	const recentApplications = applications.slice(0, 5)
	return (
		<section className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
			<PageHeader
				title={`${getTimeGreeting()}, ${user?.full_name || 'Admin'}!`}
				description="Manage users, verify work histories, monitor jobs, and respond to marketplace risks from one operational workspace."
				actions={
					<span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
						<ShieldCheck className="h-4 w-4 text-[#FF6B00]" />
						Admin Trust & Operations Desk
					</span>
				}
			/>
			<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"><AdminStat label="Users" value={users.length} description="Worker and employer accounts" icon={<Users className="h-5 w-5" />} /><AdminStat label="Open jobs" value={openJobs} description="Currently active listings" icon={<Briefcase className="h-5 w-5" />} /><AdminStat label="Verification queue" value={pendingVerification} description="Employment records awaiting review" icon={<FileCheck className="h-5 w-5" />} /><AdminStat label="Establishments" value={establishments.length} description="Venues tracked on the platform" icon={<AlertTriangle className="h-5 w-5" />} /></div>

			<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
				<StatCard title="Applications" value={applications.length} subtitle={`${hiredApplications} successful hires`} icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" />
				<StatCard title="Open support" value={openTickets} subtitle="Tickets needing attention" icon={<Headphones className="h-5 w-5" />} iconBg="bg-amber-50 text-amber-600" />
				<StatCard title="Completed payments" value={completedPayments} subtitle={`${transactions.length} payment records`} icon={<CircleDollarSign className="h-5 w-5" />} iconBg="bg-blue-50 text-blue-600" />
				<StatCard title="Managed venues" value={establishments.length} subtitle="Registered establishments" icon={<Building2 className="h-5 w-5" />} iconBg="bg-orange-50 text-[#FF6B00]" />
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<PieChart title="User composition" subtitle="Registered platform accounts" data={[{ label: 'Workers', value: workerUsers, color: '#0A2540' }, { label: 'Employers', value: employerUsers, color: '#FF6B00' }]} />
				<BarChart title="Operational queues" subtitle="Items currently requiring review or action" horizontal data={[{ label: 'Open jobs', value: openJobs, color: '#0A2540' }, { label: 'Verification', value: pendingVerification, color: '#FF6B00' }, { label: 'Support', value: openTickets, color: '#D97706' }, { label: 'Hired applications', value: hiredApplications, color: '#059669' }]} />
			</div>

			<div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
				<section className="space-y-4">
					<div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-lg font-bold text-slate-900">Recent job postings</h2><p className="text-xs text-slate-500">Monitor the latest marketplace activity.</p></div><Link to="/admin/jobs" className="text-xs font-bold text-[#FF6B00]">View all</Link></div>
					<DataTable data={recentJobs} keyExtractor={(job) => String(job.id)} emptyMessage="No job postings yet." columns={[{ header: 'Role', render: (job) => <span className="font-semibold text-slate-900">{job.title}</span> }, { header: 'Location', accessor: 'location' }, { header: 'Status', render: (job) => <Badge variant={job.status === 'open' ? 'success' : 'neutral'} size="sm">{job.status}</Badge> }]} />
				</section>
				<section className="space-y-4">
					<div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-lg font-bold text-slate-900">Application pipeline</h2><p className="text-xs text-slate-500">Latest candidate movement across shifts.</p></div><Link to="/admin/applications" className="text-xs font-bold text-[#FF6B00]">View all</Link></div>
					{recentApplications.length ? <DataTable data={recentApplications} keyExtractor={(application) => String(application.id)} columns={[{ header: 'Candidate', render: (application) => <span className="font-semibold text-slate-900">{application.worker_name || `Worker #${application.worker}`}</span> }, { header: 'Role', render: (application) => application.job_title || `Job #${application.job}` }, { header: 'Status', render: (application) => <Badge variant={application.status === 'hired' ? 'success' : 'neutral'} size="sm">{application.status.replace('_', ' ')}</Badge> }]} /> : <EmptyState title="No applications yet" description="Candidate activity will appear here." icon={<Users className="h-6 w-6" />} size="sm" />}
				</section>
			</div>
			<div className="card-kazilink space-y-4 p-6"><div><h2 className="font-display text-lg font-bold text-slate-900">Administration shortcuts</h2><p className="text-xs text-slate-500">Choose an area to continue managing the marketplace</p></div><div className="grid gap-3 sm:grid-cols-2">{managementLinks.map(([path, title, description, Icon]) => <Link key={path} to={path} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-orange-50"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0A2540] text-white"><Icon className="h-4 w-4" /></span><span className="flex-1"><strong className="block text-sm text-slate-900">{title}</strong><span className="text-xs text-slate-500">{description}</span></span><ArrowRight className="h-4 w-4 text-[#FF6B00]" /></Link>)}</div></div>
		</section>
	)
}