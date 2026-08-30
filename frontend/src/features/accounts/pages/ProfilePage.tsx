import { useAuthStore } from '../../auth/store/authStore'

export function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-[28px] bg-gradient-to-r from-[#0A2540] via-[#123860] to-[#0E2E4E] p-6 text-white sm:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-200">Account</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">My profile</h1>
      </header>

      <div className="card-kazilink p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Full name</p>
            <p className="mt-2 text-lg font-black text-slate-900">{user?.full_name || 'Not available'}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Phone</p>
            <p className="mt-2 text-lg font-black text-slate-900">{user?.phone || 'Not available'}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Role</p>
            <p className="mt-2 text-lg font-black text-slate-900">
              {user?.is_worker && user?.is_employer ? 'Worker + Employer' : user?.is_worker ? 'Worker' : user?.is_employer ? 'Employer' : user?.is_staff || user?.is_superuser ? 'Admin' : 'User'}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Email</p>
            <p className="mt-2 text-lg font-black text-slate-900">{user?.email || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
