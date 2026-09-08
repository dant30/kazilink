import { useEffect, useMemo, useState } from 'react'
import {
  Briefcase,
  CreditCard,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  X,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { endpoints } from '../../../core/api'
import { useAuthStore } from '../../auth/store/authStore'
import { ErrorBoundary } from '../../../shared/components/ui/ErrorBoundary'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Select } from '../../../shared/components/ui/Select'
import { Button } from '../../../shared/components/ui/Button'
import { Modal } from '../../../shared/components/ui/Modal'
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog'
import { StatCard } from '../../../shared/components/cards/StatCard'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { EmptyState } from '../../../shared/components/feedback'
import { workerServices } from '../services'
import type { WorkerProfile } from '../types'

const roleFilters = [
  'All',
  'Bartender',
  'Waitstaff',
  'Barista',
  'Chef',
  'Cook',
  'Cleaner',
  'Host',
]

export function WorkersPage() {
  const { user } = useAuthStore()
  const isEmployer = Boolean(user?.is_employer && !user?.is_worker)
  const navigate = useNavigate()

  const [workers, setWorkers] = useState<WorkerProfile[]>([])
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null)
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
    workerServices
      .getWorkers()
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

    endpoints.credits
      .wallet()
      .then((response) => setCreditBalance(response.wallet.balance))
      .catch(() => setCreditBalance(null))
  }, [isEmployer])

  const unlockHistory = async () => {
    if (!unlockWorker) return

    setUnlocking(true)
    setActionMessage('')
    setActionError(false)

    try {
      await endpoints.employmentHistory.unlock({
        worker_id: unlockWorker.id,
        idempotency_key: `history-unlock:${unlockWorker.id}:${Date.now()}`,
      })

      const response = await endpoints.credits.wallet()
      setCreditBalance(response.wallet.balance)
      setActionMessage(`Employment history unlocked for ${unlockWorker.user.full_name}.`)
      setUnlockWorker(null)
    } catch (reason) {
      setActionError(true)
      setActionMessage(
        reason instanceof Error ? reason.message : 'The history unlock failed. Your credits were not charged.',
      )
    } finally {
      setUnlocking(false)
    }
  }

  const handleMessageWorker = async (worker: WorkerProfile) => {
    if (!isEmployer) return

    setSelectedWorker(null)

    if ((creditBalance ?? 0) < 1) {
      navigate('/payments', { state: { openRecharge: true } })
      return
    }

    try {
      const conversation = await endpoints.messaging.createConversation({ worker_id: worker.id })
      navigate('/messages', { state: { conversationId: conversation.id } })
    } catch (reason) {
      setActionError(true)
      setActionMessage(reason instanceof Error ? reason.message : 'Unable to start a chat with this worker.')
    }
  }

  const locations = useMemo(
    () => [...new Set(workers.map((worker) => worker.location).filter(Boolean))].sort(),
    [workers],
  )

  const verifiedCount = useMemo(
    () => workers.filter((w) => w.is_reference_checked).length,
    [workers],
  )

  const filteredWorkers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return workers.filter((worker) => {
      const matchesQuery =
        !normalizedQuery ||
        `${worker.user.full_name} ${worker.primary_role} ${worker.location} ${worker.skills.join(' ')} ${worker.bio || ''}`
          .toLowerCase()
          .includes(normalizedQuery)

      const matchesLocation = !location || worker.location === location

      const matchesRole =
        selectedRole === 'All' ||
        worker.primary_role?.toLowerCase().includes(selectedRole.toLowerCase())

      const matchesVerified = !verifiedOnly || worker.is_reference_checked

      return matchesQuery && matchesLocation && matchesRole && matchesVerified
    })
  }, [location, query, selectedRole, verifiedOnly, workers])

  return (
    <ErrorBoundary>
      <section className="mx-auto max-w-7xl space-y-6 sm:space-y-8 px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8">
        <PageHeader
          eyebrow="Talent marketplace"
          title="Verified Hospitality Workers"
          description="Browse experienced, reference-verified Kenyan bartenders, waitstaff, baristas, chefs, and cleaners ready for casual shifts."
          icon={<UserRound className="h-4 w-4" />}
          actions={
            <Link
              to="/jobs/new"
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-[#0A2540] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#123860] shadow-xs"
            >
              <Briefcase className="h-3.5 w-3.5 text-[#FF6B00]" />
              Post a shift opening
            </Link>
          }
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            title="Available talent"
            value={workers.length}
            subtitle="Registered workers"
            icon={<UserRound className="h-4 w-4" />}
          />
          <StatCard
            title="Reference verified"
            value={verifiedCount}
            subtitle="100% Kenyan vetted"
            icon={<ShieldCheck className="h-4 w-4 text-emerald-600" />}
            iconBg="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            title="Active regions"
            value={locations.length || 1}
            subtitle="Nairobi, Coast, Rift Valley"
            icon={<MapPin className="h-4 w-4 text-[#FF6B00]" />}
          />
          <StatCard
            title="Immediate on-call"
            value="Ready"
            subtitle="Direct shift booking"
            icon={<Sparkles className="h-4 w-4 text-amber-500" />}
          />
        </div>

        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_auto]">
            <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs focus-within:border-[#FF6B00] focus-within:bg-white focus-within:shadow-2xs">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search worker name, skill, specialty..."
                className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 text-xs"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </label>

            <Select
              value={location}
              onChange={setLocation}
              options={[
                { value: '', label: 'All Kenyan regions' },
                ...locations.map((item) => ({ value: item, label: item })),
              ]}
              className="text-xs"
            />

            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition shrink-0 ${
                verifiedOnly
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className={`h-4 w-4 ${verifiedOnly ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Verified Only</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
              Role:
            </span>
            {roleFilters.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shrink-0 ${
                  selectedRole === role
                    ? 'bg-[#0A2540] text-white shadow-2xs'
                    : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-3xl" />
            ))}
          </div>
        )}

        {!loading && !error && (
          filteredWorkers.length ? (
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredWorkers.map((worker) => (
                <article
                  key={worker.id}
                  onClick={() => setSelectedWorker(worker)}
                  className="group relative flex flex-col justify-between cursor-pointer rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:border-[#FF6B00]/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {worker.avatar || worker.user.avatar ? (
                          <img
                            src={worker.avatar || worker.user.avatar || ''}
                            alt=""
                            className="h-12 w-12 rounded-2xl object-cover ring-2 ring-slate-100"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#FF6B00] font-black text-sm border border-orange-100">
                            {worker.user.full_name?.charAt(0) || <UserRound className="h-5 w-5" />}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors truncate">
                            {worker.user.full_name}
                          </h3>
                          <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider">
                            {worker.primary_role}
                          </p>
                        </div>
                      </div>

                      {worker.is_reference_checked && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 border border-emerald-200 shrink-0">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {worker.location || 'Nairobi, Kenya'}
                      </span>
                      <span>•</span>
                      <span>{worker.years_of_experience || 1}+ yrs exp</span>
                    </div>

                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{Number(worker.rating || 5.0).toFixed(1)}</span>
                      <span className="text-[11px] font-normal text-slate-400">
                        ({worker.reviews_count || 0} reviews)
                      </span>
                    </div>

                    {worker.bio && (
                      <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {worker.bio}
                      </p>
                    )}

                    {worker.skills.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                        {worker.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                        {worker.skills.length > 3 && (
                          <span className="rounded-lg bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                            +{worker.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {isEmployer && (
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="mb-2 text-[11px] font-bold text-slate-500">
                        History unlock: 1 Kazi Credit. Balance: <span className="font-black text-slate-800">{creditBalance ?? '...'}</span>
                      </p>

                      {creditBalance === 0 ? (
                        <Link
                          to="/payments"
                          onClick={(event) => {
                            event.preventDefault()
                            navigate('/payments', { state: { openRecharge: true } })
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A2540] px-3 py-2 text-[11px] font-bold text-white transition hover:bg-[#123860]"
                        >
                          Buy Kazi Credits
                        </Link>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={creditBalance === null || creditBalance < 1}
                          onClick={(event) => {
                            event.stopPropagation()
                            setUnlockWorker(worker)
                          }}
                          className="w-full justify-center rounded-xl"
                        >
                          Unlock history
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">View Passport</span>
                    <span className="text-xs font-bold text-[#FF6B00] group-hover:translate-x-0.5 transition">
                      Details →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No workers match these filters"
              description="Try adjusting your role, location, or search keywords."
              icon={<UserRound className="h-8 w-8 text-slate-400" />}
              size="md"
            />
          )
        )}

        {actionMessage && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
              actionError ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {actionMessage}
          </div>
        )}

        {selectedWorker && (
          <Modal
            isOpen={Boolean(selectedWorker)}
            onClose={() => setSelectedWorker(null)}
            title={selectedWorker.user.full_name}
            subtitle={selectedWorker.primary_role}
            maxWidth="md"
          >
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#FF6B00] font-black text-base">
                    {selectedWorker.user.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{selectedWorker.user.full_name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {selectedWorker.location || 'Nairobi, Kenya'}
                    </p>
                  </div>
                </div>

                {selectedWorker.is_reference_checked && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Verified
                  </span>
                )}
              </div>

              {selectedWorker.bio && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">About</h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                    {selectedWorker.bio}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hospitality Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedWorker.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => setSelectedWorker(null)} className="rounded-xl text-xs">
                  Close
                </Button>
                <Link
                  to={creditBalance && creditBalance > 0 ? '/messages' : '/payments'}
                  onClick={(event) => {
                    event.preventDefault()
                    if ((creditBalance ?? 0) < 1) {
                      navigate('/payments', { state: { openRecharge: true } })
                      return
                    }

                    void handleMessageWorker(selectedWorker)
                  }}
                  className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl bg-[#FF6B00] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#E55F00]"
                >
                  {creditBalance && creditBalance > 0 ? (
                    <MessageSquare className="h-3.5 w-3.5" />
                  ) : (
                    <CreditCard className="h-3.5 w-3.5" />
                  )}
                  {creditBalance && creditBalance > 0 ? 'Message Worker' : 'Buy Kazi Credit'}
                </Link>
              </div>
            </div>
          </Modal>
        )}
      </section>

      <ConfirmDialog
        isOpen={Boolean(unlockWorker)}
        title="Unlock employment history?"
        message={
          <span>
            This will use <strong>1 Kazi Credit</strong> to unlock {unlockWorker?.user.full_name}&apos;s consented
            employment history. Your balance is <strong>{creditBalance ?? '...'}</strong>.
          </span>
        }
        confirmLabel="Use 1 Credit"
        loading={unlocking}
        onCancel={() => setUnlockWorker(null)}
        onConfirm={unlockHistory}
      />
    </ErrorBoundary>
  )
}

