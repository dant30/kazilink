// frontend/src/features/dashboard/pages/EmployerDashboardPage.tsx
import { ArrowRight, Briefcase, Building2, CheckCircle2, CreditCard, PlusCircle, Users } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'

import { useAuthStore } from '../../auth'
import { StatCard } from '../../../shared/components/cards/StatCard'
import { EmptyState } from '../../../shared/components/feedback'
import { PieChart } from '../../../shared/components/charts'
import { DataTable } from '../../../shared/components/tables'
import { Skeleton } from '../../../shared/components/ui'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { useDashboard } from '../hooks'

export function EmployerDashboardPage() {
	const { user } = useAuthStore()
	const { data, loading, error, refresh } = useDashboard()
	const jobs = data?.jobs ?? []
	const applications = data?.applications ?? []
	const establishments = data?.establishments ?? []
	if (user?.is_worker && !user.is_employer) return <Navigate to="/dashboard/worker" replace />

	return (
		<section className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
			<PageHeader
				eyebrow="Employer workspace"
				title="Build the right team for every shift."
				description="Post roles, compare verified hospitality talent, and keep your hiring pipeline moving."
				actions={<Link to="/jobs/new" className="btn-primary-orange inline-flex text-xs sm:text-sm"><PlusCircle className="h-4 w-4" /> Post a shift</Link>}
			/>
			{loading ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-32 rounded-2xl" />)}</div> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"><StatCard title="Open jobs" value={jobs.filter((job) => job.status === 'open').length} subtitle="Accepting applications" icon={<Briefcase className="h-5 w-5" />} iconBg="bg-orange-50 text-[#FF6B00]" /><StatCard title="Applicants" value={applications.length} subtitle="In your hiring pipeline" icon={<Users className="h-5 w-5" />} /><StatCard title="Establishments" value={establishments.length} subtitle="Connected locations" icon={<Building2 className="h-5 w-5" />} iconBg="bg-amber-50 text-amber-600" /><StatCard title="Completed hires" value={applications.filter((application) => application.status === 'hired').length} subtitle="Through KaziLink" icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" /></div>}
			<div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]"><div className="card-kazilink space-y-4 p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-lg font-bold text-slate-900">Your hiring pipeline</h2><p className="text-xs text-slate-500">Review current roles and applicant activity</p></div><div className="flex items-center gap-4"><button type="button" onClick={() => refresh()} className="text-xs font-bold text-slate-500 hover:text-slate-900">Refresh</button><Link to="/jobs" className="flex items-center gap-1 text-xs font-bold text-[#FF6B00]">Manage jobs <ArrowRight className="h-3.5 w-3.5" /></Link></div></div>{error && <p className="text-sm text-rose-600">{error}</p>}{!loading && !error && jobs.length === 0 ? <EmptyState title="No jobs posted yet" description="Create your first role to start building a hiring pipeline." action={<Link to="/jobs/new" className="btn-primary-orange inline-flex text-xs">Post a shift</Link>} size="sm" /> : <DataTable data={jobs.slice(0, 6)} keyExtractor={(job) => String(job.id)} emptyMessage="No jobs posted yet." columns={[{ header: 'Role', render: (job) => <Link to={`/jobs/${job.id}`} className="font-bold text-slate-900 hover:text-[#FF6B00]">{job.title}</Link> }, { header: 'Location', accessor: 'location' }, { header: 'Status', render: (job) => <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${job.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{job.status}</span> }, { header: 'Applicants', accessor: 'applicant_count', className: 'text-right font-bold' }]} />}</div><PieChart title="Application outcomes" subtitle="Current pipeline distribution" data={[{ label: 'Applied', value: applications.filter((item) => item.status === 'applied').length, color: '#0A2540' }, { label: 'Shortlisted', value: applications.filter((item) => item.status === 'shortlisted').length, color: '#FF6B00' }, { label: 'Hired', value: applications.filter((item) => item.status === 'hired').length, color: '#059669' }, { label: 'Rejected', value: applications.filter((item) => item.status === 'rejected').length, color: '#CBD5E1' }]} /></div>
		</section>
	)
}