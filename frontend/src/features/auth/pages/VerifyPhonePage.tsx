import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '../../../shared/components/ui/Button'
import { AuthField, AuthPanel } from '../components'
import { verifyPhone } from '../services'
import { authStore } from '../store'
import { normalizeKenyanPhone } from '../../../core/utils'

export function VerifyPhonePage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [phone, setPhone] = useState(params.get('phone') ?? '')
  const [code, setCode] = useState(params.get('code') ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const normalizedPhone = normalizeKenyanPhone(phone)
    if (!normalizedPhone) { setError('Please enter a valid Kenyan mobile number.'); setSaving(false); return }
    try {
      const response = await verifyPhone(normalizedPhone, code.trim())
      authStore.setSession(response.user, response.tokens)
      const destination = response.user.is_staff || response.user.is_superuser ? '/admin' : response.user.is_employer && !response.user.is_worker ? '/dashboard/employer' : '/dashboard/worker'
      navigate(destination)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Verification failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthPanel
      eyebrow="One last step"
      title="Verify your phone"
      subtitle="Confirm your number to activate your KaziLink account and get started."
    >
      <form className="space-y-5" onSubmit={submit}>
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
          label="Verification code"
          required
          inputMode="numeric"
          maxLength={8}
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={saving}>
          {saving ? 'Verifying...' : 'Verify phone'}
        </Button>
      </form>
    </AuthPanel>
  )
}
