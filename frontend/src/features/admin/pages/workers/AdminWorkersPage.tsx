import { Search, ShieldCheck, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../../../../shared/components/tables'
import { StatCard } from '../../../../shared/components/cards/StatCard'
import { PageHeader } from '../../../../shared/components/ui/PageHeader'
import { endpoints } from '../../../../core/api'
import type { WorkerProfile } from '../../../workers/types'

export function AdminWorkersPage() {
	const [workers, setWorkers] = useState<WorkerProfile[]>([])
	const [query, setQuery] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	useEffect(() => { endpoints.workers.list().then((data) => setWorkers(Array.isArray(data) ? data : data.results)).catch((reason: Error) => setError(reason.message)).finally(() => setLoading(false)) }, [])
	const filtered = useMemo(() => workers.filter((worker) => `${worker.user.full_name} ${worker.primary_role} ${worker.location}`.toLowerCase().includes(query.toLowerCase())), [workers, query])
	return <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"><PageHeader eyebrow="Admin directory" title="Worker accounts" description="Review worker profiles and verification signals." /><div className="grid gap-4 md:grid-cols-3"><StatCard title="Workers" value={workers.length} subtitle="Registered worker profiles" icon={<Users className="h-5 w-5" />} /><StatCard title="Open to work" value={workers.filter((worker) => worker.open_to_work).length} subtitle="Currently available" icon={<ShieldCheck className="h-5 w-5" />} iconBg="bg-emerald-50 text-emerald-600" /><StatCard title="Verified ID" value={workers.filter((worker) => worker.user.is_id_verified).length} subtitle="Identity verified" icon={<ShieldCheck className="h-5 w-5" />} iconBg="bg-orange-50 text-[#FF6B00]" /></div><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 sm:max-w-sm"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search workers" className="w-full bg-transparent text-sm outline-none" /></div>{error ? <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : loading ? <p className="p-6 text-sm text-slate-500">Loading workers...</p> : <DataTable data={filtered} keyExtractor={(worker) => String(worker.id)} emptyMessage="No workers match this search." columns={[{ header: 'Worker', render: (worker) => <span className="font-bold text-slate-900">{worker.user.full_name}</span> }, { header: 'Role', accessor: 'primary_role' }, { header: 'Location', accessor: 'location' }, { header: 'Experience', render: (worker) => `${worker.years_of_experience} years` }, { header: 'Status', render: (worker) => worker.open_to_work ? 'Available' : 'Unavailable' }]} />}</section></section>
}
