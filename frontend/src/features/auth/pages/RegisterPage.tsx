// frontend/src/features/auth/pages/RegisterPage.tsx
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthField, AuthPanel } from '../components'
import { register } from '../services'

export function RegisterPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState<'worker' | 'employer'>('worker')
  const [form, setForm] = useState({
    phone: '',
    full_name: '',
    email: '',
    password: '',
    primary_role: '',
    location: '',
    availability: 'immediate',
    expected_daily_rate_ksh: '',
    bio: '',
    contact_person: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }))

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      // Build payload with proper validation
      const payload: Record<string, unknown> = {
        phone: form.phone.trim(),
        full_name: form.full_name.trim(),
        password: form.password,
        role,
      }

      // Add optional fields if they have values
      if (form.email.trim()) payload.email = form.email.trim()

      if (role === 'worker') {
        if (!form.primary_role.trim()) {
          setError('Primary role is required for workers.')
          setSaving(false)
          return
        }
        if (!form.location.trim()) {
          setError('Location is required for workers.')
          setSaving(false)
          return
        }
        if (!form.bio.trim()) {
          setError('Bio is required for workers.')
          setSaving(false)
          return
        }
        if (!form.expected_daily_rate_ksh) {
          setError('Expected daily rate is required for workers.')
          setSaving(false)
          return
        }

        payload.primary_role = form.primary_role.trim()
        payload.location = form.location.trim()
        payload.availability = form.availability
        payload.expected_daily_rate_ksh = Number(form.expected_daily_rate_ksh)
        payload.bio = form.bio.trim()
      } else {
        if (!form.contact_person.trim()) {
          setError('Contact person name is required for employers.')
          setSaving(false)
          return
        }
        payload.contact_person = form.contact_person.trim()
      }

      const response = await register(payload)
      navigate(
        `/verify-phone?phone=${encodeURIComponent(form.phone)}${
          response.verification_code ? `&code=${response.verification_code}` : ''
        }`
      )
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to create your account.')
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <AuthPanel eyebrow="Join KaziLink" title="Create your account">
      <form className="auth-form" onSubmit={submit}>
        <div className="role-toggle" role="group" aria-label="Account type">
          <button
            className={role === 'worker' ? 'selected' : ''}
            type="button"
            onClick={() => setRole('worker')}
          >
            I am a worker
          </button>
          <button
            className={role === 'employer' ? 'selected' : ''}
            type="button"
            onClick={() => setRole('employer')}
          >
            I am an employer
          </button>
        </div>

        <AuthField
          label="Full name"
          required
          value={form.full_name}
          onChange={(event) => update('full_name', event.target.value)}
        />
        <AuthField
          label="Phone number"
          required
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => update('phone', event.target.value)}
        />
        <AuthField
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
        />
        <AuthField
          label="Password"
          required
          minLength={8}
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(event) => update('password', event.target.value)}
        />

        {role === 'worker' ? (
          <>
            <AuthField
              label="Primary role"
              required
              value={form.primary_role}
              onChange={(event) => update('primary_role', event.target.value)}
            />
            <AuthField
              label="Location"
              required
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
            />
            <label className="auth-field">
              <span className="auth-field__label">Availability</span>
              <select
                className="auth-input"
                value={form.availability}
                onChange={(event) => update('availability', event.target.value)}
              >
                <option value="immediate">Immediate</option>
                <option value="night_shifts">Night shifts</option>
                <option value="full_time">Full time</option>
                <option value="part_time">Part time</option>
              </select>
            </label>
            <AuthField
              label="Expected daily rate (KSh)"
              required
              type="number"
              min="0"
              value={form.expected_daily_rate_ksh}
              onChange={(event) => update('expected_daily_rate_ksh', event.target.value)}
            />
            <AuthField
              label="Short bio"
              required
              multiline
              value={form.bio}
              onChange={(event) => update('bio', event.target.value)}
            />
          </>
        ) : (
          <AuthField
            label="Contact person"
            required
            value={form.contact_person}
            onChange={(event) => update('contact_person', event.target.value)}
          />
        )}

        {error && <div className="feedback error">{error}</div>}
        <button type="submit" className="button button-primary" disabled={saving}>
          {saving ? 'Creating account...' : 'Create account'}
        </button>

        <div className="auth-links">
          <Link to="/login">Already have an account?</Link>
        </div>
      </form>
    </AuthPanel>
  )
}
