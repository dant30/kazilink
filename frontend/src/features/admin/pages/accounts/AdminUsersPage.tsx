import { Search, ShieldCheck, Users } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useAdminUsers } from '../../hooks'
import { PageHeader } from '../../../../shared/components/ui/PageHeader'
import { Pagination } from '../../../../shared/components/ui/Pagination'
import { Skeleton } from '../../../../shared/components/ui/Skeleton'
import { EmptyState } from '../../../../shared/components/feedback'

export function AdminUsersPage() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const { users, loading, error } = useAdminUsers()

  const filteredUsers = useMemo(() => {
    const text = query.toLowerCase()
    return users.filter((user) => `${user.full_name} ${user.phone} ${user.email ?? ''}`.toLowerCase().includes(text))
  }, [query, users])
  const pageSize = 10
  const visibleUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize)

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Admin access" title="User directory" actions={<div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200"><ShieldCheck className="h-4 w-4 text-[#FF6B00]" />{users.length} accounts</div>} />

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
              onChange={(event) => { setQuery(event.target.value); setPage(1) }}
              placeholder="Search users"
              className="w-56 bg-transparent outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        {loading && <div className="mt-6 space-y-3" aria-label="Loading users" aria-busy="true"><Skeleton className="h-20 rounded-2xl" /><Skeleton className="h-20 rounded-2xl" /><Skeleton className="h-20 rounded-2xl" /></div>}
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {!loading && !error && filteredUsers.length === 0 && (
          <EmptyState title="No users match the current search" description="Try a different name, phone number, or email address." icon={<Users className="h-8 w-8" />} size="md" className="mt-6" />
        )}

        {!loading && !error && filteredUsers.length > 0 && (
          <div className="mt-6 space-y-3">
            {visibleUsers.map((user) => (
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
            <Pagination page={page} pageSize={pageSize} total={filteredUsers.length} onPageChange={setPage} />
          </div>
        )}
      </div>
    </section>
  )
}
