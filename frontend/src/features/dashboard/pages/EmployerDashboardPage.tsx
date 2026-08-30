// frontend/src/features/dashboard/pages/EmployerDashboardPage.tsx
import { ArrowRight, Briefcase, Building2, CreditCard, PlusCircle, Users } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'

import { useAuthStore } from '../../auth'
import { useJobs } from '../../jobs/hooks'
import { DashboardStat } from '../components'

export function EmployerDashboardPage() {
	const { user } = useAuthStore()
	const { jobs, loading, error } = useJobs({})
	if (user?.is_worker && !user.is_employer) return <Navigate to="/dashboard/worker" replace />

	return (
		<section className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6">
			<header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A2540] via-[#153B64] to-[#0E2E4E] p-6 text-white shadow-sm sm:p-8"><div className="relative z-10 max-w-2xl space-y-3"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold"><span className="h-2 w-2 rounded-full bg-[#FF6B00]" /> Employer workspace</span><h1 className="font-display text-2xl font-black text-white sm:text-4xl">Build the right team for every shift.</h1><p className="text-sm leading-relaxed text-slate-200 sm:text-base">Post roles, compare verified hospitality talent, and keep your hiring pipeline moving.</p><Link to="/jobs/new" className="btn-primary-orange inline-flex text-xs sm:text-sm"><PlusCircle className="h-4 w-4" /> Post a shift</Link></div></header>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"><DashboardStat label="Your open jobs" value={jobs.filter((job) => job.status === 'open').length} description="Currently accepting applications" icon={<Briefcase className="h-5 w-5" />} accent="orange" /><DashboardStat label="Applicants" value={jobs.reduce((total, job) => total + job.applicant_count, 0)} description="Across your current postings" icon={<Users className="h-5 w-5" />} accent="navy" /><DashboardStat label="Venues" value="Manage" description="Keep establishment details current" icon={<Building2 className="h-5 w-5" />} accent="amber" /><DashboardStat label="M-Pesa credits" value="View" description="Manage history unlocks and payouts" icon={<CreditCard className="h-5 w-5" />} accent="emerald" /></div>
			<div className="card-kazilink space-y-4 p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-lg font-bold text-slate-900">Your hiring pipeline</h2><p className="text-xs text-slate-500">Review current roles and applicant activity</p></div><Link to="/jobs" className="flex items-center gap-1 text-xs font-bold text-[#FF6B00]">Manage jobs <ArrowRight className="h-3.5 w-3.5" /></Link></div>{loading && <p className="text-sm text-slate-500">Loading your jobs...</p>}{error && <p className="text-sm text-rose-600">{error}</p>}<div className="grid gap-3 md:grid-cols-2">{jobs.slice(0, 6).map((job) => <Link key={job.id} to={`/jobs/${job.id}`} className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-white"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-bold text-slate-900">{job.title}</h3><span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${job.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{job.status}</span></div><p className="mt-2 text-xs text-slate-500">{job.location} · {job.applicant_count} applicants</p></Link>)}{!loading && !error && jobs.length === 0 && <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500 md:col-span-2">You have not posted any jobs yet.</p>}</div></div>
		</section>
	)
}