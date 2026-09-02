import { useAuthStore } from '../../auth/store/authStore'
import { PageHeader } from '../../../shared/components/ui/PageHeader'

export function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Account" title="My profile" />

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
