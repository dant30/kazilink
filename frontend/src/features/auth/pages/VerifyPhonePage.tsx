// frontend/src/features/auth/pages/VerifyPhonePage.tsx
import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { AuthField, AuthPanel } from '../components'
import { verifyPhone } from '../services'
import { authStore } from '../store'

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

    try {
      const response = await verifyPhone(phone, code)
      authStore.setSession(response.user, response.tokens)
      navigate('/dashboard')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Verification failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthPanel eyebrow="One last step" title="Verify your phone">
      <form className="auth-form" onSubmit={submit}>
        <AuthField
          label="Phone number"
          required
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
        {error && <div className="feedback error">{error}</div>}
        <button className="button button-primary" disabled={saving} type="submit">
          {saving ? 'Verifying...' : 'Verify phone'}
        </button>
      </form>
    </AuthPanel>
  )
}
