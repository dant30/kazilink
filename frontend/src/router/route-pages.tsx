// frontend/src/router/route-pages.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

import { MainLayout } from '../shared/layouts/MainLayout'

function hasSession() {
  return Boolean(localStorage.getItem('kazilink.access_token'))
}

function isAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem('kazilink.user') ?? '{}') as { is_staff?: boolean; is_superuser?: boolean }
    return Boolean(user.is_staff || user.is_superuser)
  } catch {
    return false
  }
}

export function PublicLayout() {
  return <MainLayout><Outlet /></MainLayout>
}

export function PrivateLayout() {
  return <MainLayout><Outlet /></MainLayout>
}

export function AdminLayout() {
  return <MainLayout admin><Outlet /></MainLayout>
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation()
  return hasSession() ? <>{children}</> : <Navigate to="/login" replace state={{ from: location }} />
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  return isAdmin() ? <>{children}</> : <Navigate to="/unauthorized" replace />
}

export function UnauthorizedPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-4 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
          403
        </div>
        <h1 className="text-3xl font-black text-slate-900">Access denied</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          You do not have permission to view this page. Please sign in with the correct account or return to the dashboard.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/" className="inline-flex items-center justify-center rounded-xl bg-[#FF6B00] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E55F00]">
            Go to home
          </a>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Go back
          </button>
        </div>
      </div>
    </section>
  )
}

export function Screen({ title, description }: { title: string; description?: string }) {
  return <section><h1>{title}</h1>{description && <p>{description}</p>}</section>
}

export function NotFound() {
  return <Screen title="Page not found" description="The page you requested does not exist." />
}