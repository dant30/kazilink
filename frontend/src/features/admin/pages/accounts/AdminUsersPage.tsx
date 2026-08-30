import { Search, ShieldCheck, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { endpoints } from '../../../../core/api'
import type { User } from '../../../auth/types'

export function AdminUsersPage() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    endpoints.auth.adminUsers()
      .then((data) => {
        if (!active) return
        const results = Array.isArray(data) ? data : data.results ?? []
        setUsers(results)
      })
      .catch((reason: Error) => {
        if (!active) return
        setError(reason.message)
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const filteredUsers = useMemo(() => {
    const text = query.toLowerCase()
    return users.filter((user) => `${user.full_name} ${user.phone} ${user.email ?? ''}`.toLowerCase().includes(text))
  }, [query, users])

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-[28px] bg-gradient-to-r from-[#0A2540] via-[#123860] to-[#0E2E4E] p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-200">Admin access</p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">User directory</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200">
            <ShieldCheck className="h-4 w-4 text-[#FF6B00]" />
            {users.length} accounts
          </div>
        </div>
      </header>

      <div className="card-kazilink p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Manage people</h2>
            <p className="text-xs text-slate-500">Search workers, employers, and admin accounts.</p>
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users"
              className="w-56 bg-transparent outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        {loading && <p className="mt-6 text-sm text-slate-500">Loading users...</p>}
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {!loading && !error && filteredUsers.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
            No users match the current search.
          </div>
        )}

        {!loading && !error && filteredUsers.length > 0 && (
          <div className="mt-6 space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-black text-slate-900">{user.full_name}</p>
                    <p className="text-sm text-slate-600">{user.phone}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700">
                    <Users className="h-3.5 w-3.5" />
                    {user.is_staff || user.is_superuser ? 'Admin' : user.is_worker && user.is_employer ? 'Worker + Employer' : user.is_worker ? 'Worker' : user.is_employer ? 'Employer' : 'User'}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2 py-1">{user.email || 'No email'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
