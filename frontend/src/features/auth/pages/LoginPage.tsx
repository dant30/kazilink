import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight, Phone } from 'lucide-react'

import { FormActions } from '../../../shared/components/forms/FormActions'
import { FormSection } from '../../../shared/components/forms/FormSection'
import { AuthField, AuthPanel } from '../components'
import { login } from '../services'
import { authStore } from '../store'
import { isValidKenyanPhone, normalizeKenyanPhone } from '../../../core/utils'
import { localStorageStore } from '../../../core/storage'

const REMEMBERED_PHONE_KEY = 'kazilink.remembered_phone'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [capsLockActive, setCapsLockActive] = useState(false)
  const [isPhoneUnverified, setIsPhoneUnverified] = useState(false)
  const [isNetworkError, setIsNetworkError] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { const savedPhone = localStorageStore.getString(REMEMBERED_PHONE_KEY); if (savedPhone) setPhone(savedPhone) }, [])
  const handleKeyState = (event: KeyboardEvent<HTMLElement>) => setCapsLockActive(event.getModifierState?.('CapsLock') ?? false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setIsPhoneUnverified(false)
    setIsNetworkError(false)

    const normalizedPhone = normalizeKenyanPhone(phone)
    if (!normalizedPhone) { setError('Please enter your phone number.'); setSaving(false); return }
    if (!password) { setError('Please enter your password.'); setSaving(false); return }
    try {
      const response = await login(normalizedPhone, password)
      if (rememberMe) localStorageStore.setString(REMEMBERED_PHONE_KEY, normalizedPhone)
      else localStorageStore.remove(REMEMBERED_PHONE_KEY)
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
      const message = reason instanceof Error ? reason.message : 'Unable to sign in.'
      const lower = message.toLowerCase()
      if (lower.includes('verify your phone') || lower.includes('not verified') || lower.includes('verification')) setIsPhoneUnverified(true)
      if (lower.includes('network error') || lower.includes('failed to fetch') || lower.includes('connection refused') || lower.includes('could not be completed') || message.includes('ERR_CONNECTION')) { setIsNetworkError(true); setError('Backend API is currently offline or unreachable.') } else setError(message)
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
          <form id="login-form" className="space-y-4" onSubmit={submit}>
            <AuthField
              label="Phone number"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0712 345 678 or +254 7XX XXX XXX"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              helperText={isValidKenyanPhone(phone) ? `Standard format: ${normalizeKenyanPhone(phone)}` : 'Use a Kenyan mobile number'}
            />

            <AuthField
              label="Password"
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={handleKeyState}
              onKeyUp={handleKeyState}
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs sm:text-sm"><label className="flex min-h-[36px] cursor-pointer items-center gap-2 font-medium text-slate-600"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#FF6B00] focus:ring-[#FF6B00]" />Remember phone</label><Link className="font-bold text-[#0A2540] hover:text-[#FF6B00]" to="/forgot-password">Forgot password?</Link></div>
            {capsLockActive && <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700"><AlertCircle className="h-3.5 w-3.5" />Caps Lock is ON</div>}
            {isPhoneUnverified && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800"><div className="flex items-start gap-2.5"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><div><strong className="block text-amber-900">Phone verification required</strong><span>Your account needs SMS OTP verification before sign in.</span><Link to={`/verify-phone?phone=${encodeURIComponent(normalizeKenyanPhone(phone))}`} className="mt-2 inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#0A2540] px-3 py-2 font-bold text-white">Verify phone <ArrowRight className="h-3.5 w-3.5" /></Link></div></div></div>}
            {isNetworkError && <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-900"><strong>Backend unavailable.</strong> Check the API service or try again shortly.</div>}
            {error && !isPhoneUnverified && !isNetworkError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

          </form>
        </div>

        <div className="fixed inset-x-0 bottom-16 z-30 border-t border-slate-200 bg-white/95 px-3 py-2.5 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:static sm:border-0 sm:bg-transparent sm:shadow-none sm:px-0 sm:py-0 sm:pt-4">
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

              <div className="flex items-center justify-between gap-3 text-sm"><Link className="font-semibold text-[#0A2540] transition hover:text-[#FF6B00]" to="/forgot-password">Forgot password?</Link><Link className="font-semibold text-[#0A2540] transition hover:text-[#FF6B00]" to="/register">Create an account</Link></div>
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
