// frontend/src/features/dashboard/pages/WorkerDashboardPage.tsx
import { ArrowRight, Briefcase, CheckCircle2, Clock, MessageSquare, ShieldCheck } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'

import { useAuthStore } from '../../auth'
import { StatCard } from '../../../shared/components/cards/StatCard'
import { EmptyState } from '../../../shared/components/feedback'
import { PieChart, GaugeChart } from '../../../shared/components/charts'
import { Skeleton } from '../../../shared/components/ui'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { useDashboard } from '../hooks'

export function WorkerDashboardPage() {
	const { user } = useAuthStore()
	const { data, loading, error } = useDashboard()
	const jobs = data?.jobs ?? []
	const applications = data?.applications ?? []
	const profile = data?.workerProfile
	const profileFields = profile ? [profile.primary_role, profile.location, profile.bio, profile.skills.length > 0, profile.languages.length > 0, profile.last_employer].filter(Boolean).length : 0
	const profileStrength = profile ? Math.round((profileFields / 6) * 100) : 0
	if (user?.is_employer && !user.is_worker) return <Navigate to="/dashboard/employer" replace />

	return (
		<section className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
			<PageHeader
				eyebrow="Worker workspace"
				title="Your next shift starts here."
				description="Find reliable hospitality work, keep your history current, and build a profile employers can trust."
				actions={<Link to="/jobs" className="btn-primary-orange inline-flex text-xs sm:text-sm">Find open shifts <ArrowRight className="h-4 w-4" /></Link>}
			/>
			{loading ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-32 rounded-2xl" />)}</div> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"><StatCard title="Open shifts" value={jobs.length} subtitle="Recommended opportunities" icon={<Briefcase className="h-5 w-5" />} iconBg="bg-orange-50 text-[#FF6B00]" /><StatCard title="Profile strength" value={`${profileStrength}%`} subtitle="Completed profile details" icon={<ShieldCheck className="h-5 w-5" />} /><StatCard title="Completed shifts" value={profile?.jobs_completed ?? 0} subtitle="Hires on your profile" icon={<Clock className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" /><StatCard title="Active applications" value={applications.filter((application) => !['rejected', 'hired'].includes(application.status)).length} subtitle={`${data?.activeConversations ?? 0} active conversations`} icon={<MessageSquare className="h-5 w-5" />} iconBg="bg-amber-50 text-amber-600" /></div>}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<div className="card-kazilink space-y-4 p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-lg font-bold text-slate-900">Recommended shifts</h2><p className="text-xs text-slate-500">Roles looking for immediate confirmation</p></div><Link to="/jobs" className="flex items-center gap-1 text-xs font-bold text-[#FF6B00]">Browse all <ArrowRight className="h-3.5 w-3.5" /></Link></div>{error && <p className="text-sm text-rose-600">{error}</p>}<div className="space-y-3">{jobs.slice(0, 4).map((job) => <Link key={job.id} to={`/jobs/${job.id}`} className="block rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-white"><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-bold text-slate-900">{job.title}</h3><p className="mt-1 text-xs text-slate-500">{job.location} · {job.job_type}</p></div><span className="text-sm font-black text-[#0A2540]">KSh {job.pay_amount_ksh.toLocaleString()}</span></div></Link>)}{!loading && !error && jobs.length === 0 && <EmptyState title="No recommended shifts" description="No urgent opportunities match your profile right now." action={<Link to="/jobs" className="btn-primary-orange inline-flex text-xs">Browse all shifts</Link>} size="sm" />}</div></div><div className="space-y-6"><GaugeChart value={profileStrength} title="Profile completion" subtitle="Keep your work passport current" label="complete" showMinMax={false} /><PieChart title="Application status" subtitle="Your current applications" data={[{ label: 'Applied', value: applications.filter((item) => item.status === 'applied').length, color: '#0A2540' }, { label: 'Shortlisted', value: applications.filter((item) => item.status === 'shortlisted').length, color: '#FF6B00' }, { label: 'Hired', value: applications.filter((item) => item.status === 'hired').length, color: '#059669' }, { label: 'Rejected', value: applications.filter((item) => item.status === 'rejected').length, color: '#CBD5E1' }]} /></div>
				<div className="card-kazilink space-y-4 p-6"><div><h2 className="font-display text-lg font-bold text-slate-900">Keep your work passport ready</h2><p className="text-xs text-slate-500">Small updates make it easier to get selected</p></div><Link to="/profile/worker" className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-orange-200 hover:bg-orange-50"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF6B00]" /><span><strong className="block text-sm text-slate-900">Complete your profile</strong><span className="text-xs text-slate-500">Your profile is {profileStrength}% complete.</span></span></Link><Link to="/employment-history" className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-orange-200 hover:bg-orange-50"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF6B00]" /><span><strong className="block text-sm text-slate-900">Verify employment history</strong><span className="text-xs text-slate-500">{profile?.reviews_count ?? 0} reviews currently support your work record.</span></span></Link><Link to="/messages" className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-orange-200 hover:bg-orange-50"><MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-[#0A2540]" /><span><strong className="block text-sm text-slate-900">Check messages</strong><span className="text-xs text-slate-500">{data?.activeConversations ?? 0} active conversations.</span></span></Link></div>
			</div>
		</section>
	)
}