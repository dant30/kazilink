// frontend/src/features/auth/pages/LoginPage.tsx
import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

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
      const roleDashboard = (response.user.is_staff || response.user.is_superuser)
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
    <AuthPanel eyebrow="Welcome back" title="Sign in to KaziLink">
      <form className="auth-form" onSubmit={submit}>
        <AuthField
          label="Phone number"
          required
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
        {error && <div className="feedback error">{error}</div>}
        <button className="button button-primary" disabled={saving} type="submit">
          {saving ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/register">Create an account</Link>
        </div>
      </form>
    </AuthPanel>
  )
}
