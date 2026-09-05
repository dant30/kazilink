import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { FormActions } from '../../../shared/components/forms/FormActions'
import { FormSection } from '../../../shared/components/forms/FormSection'
import { AuthField, AuthPanel } from '../components'
import { login } from '../services'
import { authStore } from '../store'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await login(phone, password)
      authStore.setSession(response.user, response.tokens)
      const requestedPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
      const roleDashboard = response.user.is_staff || response.user.is_superuser
        ? '/admin'
        : response.user.is_employer && !response.user.is_worker
          ? '/dashboard/employer'
          : '/dashboard/worker'
      const from = requestedPath && requestedPath !== '/' ? requestedPath : roleDashboard
      navigate(from)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthPanel
      eyebrow="Welcome back"
      title="Sign in to KaziLink"
      subtitle="Access verified work opportunities and manage trusted hiring in one secure place."
    >
      <FormSection title="Welcome back" description="Use your registered phone number and password to continue.">
        <div className="pb-24 sm:pb-0">
          <form id="login-form" className="space-y-5" onSubmit={submit}>
            <AuthField
              label="Phone number"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />

            <AuthField
              label="Password"
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

          </form>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/90 px-3 py-2.5 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:static sm:border-0 sm:bg-transparent sm:shadow-none sm:px-0 sm:py-0 sm:pt-4">
          <div className="mx-auto max-w-xl sm:max-w-none">
            <div className="space-y-2 sm:space-y-3">
              <FormActions
                submitLabel={saving ? 'Signing in...' : 'Sign in'}
                loading={saving}
                align="center"
                className="border-t-0 pt-0"
                fullWidth
                formId="login-form"
              />

              <div className="flex items-center justify-between gap-3 text-sm">
                <Link className="font-semibold text-[#0A2540] transition hover:text-[#FF6B00]" to="/forgot-password">
                  Forgot password?
                </Link>
                <Link className="font-semibold text-[#0A2540] transition hover:text-[#FF6B00]" to="/register">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </FormSection>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-[11px] font-medium text-slate-600">
        Protected by secure KaziLink authentication and verified employer profiles.
      </div>
    </AuthPanel>
  )
}
