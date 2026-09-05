import { useEffect, useMemo, useState } from 'react'
import { MapPin, Search, ShieldCheck, Star, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

import { endpoints } from '../../../core/api'
import { useAuthStore } from '../../auth/store/authStore'
import { ErrorBoundary } from '../../../shared/components/ui/ErrorBoundary'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Button } from '../../../shared/components/ui/Button'
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog'
import { Select } from '../../../shared/components/ui/Select'
import { EmptyState } from '../../../shared/components/feedback'
import { workerServices } from '../services'
import type { WorkerProfile } from '../types'

export function WorkersPage() {
  const { user } = useAuthStore()
  const isEmployer = Boolean(user?.is_employer && !user?.is_worker)
  const [workers, setWorkers] = useState<WorkerProfile[]>([])
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creditBalance, setCreditBalance] = useState<number | null>(null)
  const [unlockWorker, setUnlockWorker] = useState<WorkerProfile | null>(null)
  const [unlocking, setUnlocking] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const [actionError, setActionError] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    workerServices.getWorkers()
      .then((result) => {
        if (active) setWorkers(result)
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Unable to load workers.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!isEmployer) return
    endpoints.credits.wallet().then((response) => setCreditBalance(response.wallet.balance)).catch(() => setCreditBalance(null))
  }, [isEmployer])

  const unlockHistory = async () => {
    if (!unlockWorker) return
    setUnlocking(true)
    setActionMessage('')
    setActionError(false)
    try {
      await endpoints.employmentHistory.unlock({ worker_id: unlockWorker.id, idempotency_key: `history-unlock:${unlockWorker.id}:${Date.now()}` })
      const response = await endpoints.credits.wallet()
      setCreditBalance(response.wallet.balance)
      setActionMessage(`Employment history unlocked for ${unlockWorker.user.full_name}.`)
      setUnlockWorker(null)
    } catch (reason) {
      setActionError(true)
      setActionMessage(reason instanceof Error ? reason.message : 'The history unlock failed. Your credits were not charged.')
    } finally {
      setUnlocking(false)
    }
  }

  const locations = useMemo(() => [...new Set(workers.map((worker) => worker.location).filter(Boolean))].sort(), [workers])
  const filteredWorkers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return workers.filter((worker) => {
      const searchable = `${worker.user.full_name} ${worker.primary_role} ${worker.location} ${worker.skills.join(' ')}`.toLowerCase()
      return (!normalizedQuery || searchable.includes(normalizedQuery)) && (!location || worker.location === location)
    })
  }, [location, query, workers])

  return (
    <ErrorBoundary>
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Talent marketplace"
          title="Find verified workers"
          description="Browse experienced hospitality professionals who are open to new opportunities."
          icon={<UserRound className="h-4 w-4" />}
        />

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, role, or skill" className="w-full bg-transparent outline-none" />
          </label>
          <Select value={location} onChange={setLocation} options={[{ value: '', label: 'All locations' }, ...locations.map((item) => ({ value: item, label: item }))]} />
        </div>

        {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{error}</div>}
        {loading && <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading worker profiles...</div>}

        {!loading && !error && (
          filteredWorkers.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredWorkers.map((worker) => (
                <article key={worker.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {worker.avatar || worker.user.avatar ? <img src={worker.avatar || worker.user.avatar || ''} alt="" className="h-12 w-12 rounded-full object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF2E8] text-[#FF6B00]"><UserRound className="h-5 w-5" /></div>}
                      <div>
                        <h2 className="font-black text-slate-900">{worker.user.full_name}</h2>
                        <p className="text-sm font-semibold text-[#FF6B00]">{worker.primary_role}</p>
                      </div>
                    </div>
                    {worker.is_reference_checked && <ShieldCheck className="h-5 w-5 text-emerald-600" aria-label="Reference checked" />}
                  </div>
                  <div className="mt-5 flex items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{worker.location || 'Location not provided'}</span>
                    <span>{worker.years_of_experience} yrs experience</span>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-sm font-bold text-slate-700"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{Number(worker.rating).toFixed(1)} <span className="font-normal text-slate-400">({worker.reviews_count} reviews)</span></div>
                  {worker.skills.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{worker.skills.slice(0, 4).map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{skill}</span>)}</div>}
                  {isEmployer && <div className="mt-5 border-t border-slate-100 pt-4"><p className="mb-2 text-xs text-slate-500">History unlock: 1 Kazi Credit. Balance: <strong>{creditBalance ?? '...'}</strong></p>{creditBalance === 0 ? <Link to="/payments" className="text-xs font-bold text-[#FF6B00] underline">Buy Kazi Credits</Link> : <Button size="sm" variant="outline" disabled={creditBalance === null || creditBalance < 1} onClick={() => setUnlockWorker(worker)}>Unlock employment history</Button>}</div>}
                </article>
              ))}
            </div>
          ) : <EmptyState title="No workers match these filters" description="Try adjusting the search criteria." icon={<UserRound className="h-8 w-8" />} />
        )}
      </section>
      {actionMessage && <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${actionError ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{actionMessage}</div>}
      <ConfirmDialog
        isOpen={Boolean(unlockWorker)}
        title="Unlock employment history?"
        message={<span>This will use <strong>1 Kazi Credit</strong> to unlock {unlockWorker?.user.full_name}&apos;s consented employment history. Your balance is <strong>{creditBalance ?? '...'}</strong>.</span>}
        confirmLabel="Use 1 Credit"
        loading={unlocking}
        onCancel={() => setUnlockWorker(null)}
        onConfirm={unlockHistory}
      />
    </ErrorBoundary>
  )
}
