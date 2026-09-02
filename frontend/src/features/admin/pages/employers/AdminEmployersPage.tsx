import { Building2, Search, ShieldCheck, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../../../../shared/components/tables'
import { StatCard } from '../../../../shared/components/cards/StatCard'
import { PageHeader } from '../../../../shared/components/ui/PageHeader'
import { Skeleton } from '../../../../shared/components/ui/Skeleton'
import { endpoints } from '../../../../core/api'
import type { User } from '../../../auth/types'

export function AdminEmployersPage() {
	const [users, setUsers] = useState<User[]>([])
	const [query, setQuery] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	useEffect(() => { endpoints.auth.adminUsers().then((data) => setUsers(Array.isArray(data) ? data : data.results)).catch((reason: Error) => setError(reason.message)).finally(() => setLoading(false)) }, [])
	const employers = useMemo(() => users.filter((user) => user.is_employer && !user.is_worker && `${user.full_name} ${user.phone} ${user.email || ''}`.toLowerCase().includes(query.toLowerCase())), [users, query])
	return <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"><PageHeader eyebrow="Admin directory" title="Employer accounts" description="Review employer identities and account access." /><div className="grid gap-4 md:grid-cols-3"><StatCard title="Employers" value={users.filter((user) => user.is_employer && !user.is_worker).length} subtitle="Registered employer accounts" icon={<Users className="h-5 w-5" />} /><StatCard title="Verified accounts" value={employers.length} subtitle="Accounts matching the current filter" icon={<ShieldCheck className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" /><StatCard title="Business access" value={employers.length} subtitle="Accounts available to manage" icon={<Building2 className="h-5 w-5" />} iconBg="bg-orange-50 text-[#FF6B00]" /></div><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 sm:max-w-sm"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employers" className="w-full bg-transparent text-sm outline-none" /></div>{error ? <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : loading ? <div className="space-y-3 p-6" aria-label="Loading employers" aria-busy="true"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div> : <DataTable data={employers} keyExtractor={(user) => String(user.id)} emptyMessage="No employers match this search." columns={[{ header: 'Employer', render: (user) => <span className="font-bold text-slate-900">{user.full_name}</span> }, { header: 'Phone', accessor: 'phone' }, { header: 'Email', render: (user) => user.email || 'Not provided' }, { header: 'Verification', render: () => 'Active' }]} />}</section></section>
}
