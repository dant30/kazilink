import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FormActions } from '../../../shared/components/forms/FormActions'
import { FormSection } from '../../../shared/components/forms/FormSection'
import { Checkbox } from '../../../shared/components/ui/Checkbox'
import { Select } from '../../../shared/components/ui/Select'
import { AuthField, AuthPanel, PasswordStrengthBar } from '../components'
import { register } from '../services'
import { endpoints } from '../../../core/api'
import { isValidKenyanPhone, normalizeKenyanPhone } from '../../../core/utils'

export function RegisterPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState<'worker' | 'employer'>('worker')
  const [form, setForm] = useState({ phone: '', full_name: '', email: '', password: '', confirm_password: '', primary_role: '', location: '', availability: 'immediate', expected_daily_rate_ksh: '', bio: '', contact_person: '', referral_code: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [workerRoles, setWorkerRoles] = useState<Array<{ value: string; label: string }>>([])
  const [availabilityOptions, setAvailabilityOptions] = useState<Array<{ value: string; label: string }>>([])

  useEffect(() => {
    endpoints.auth.workerOccupations().then((response) => { setWorkerRoles(response.occupations); setAvailabilityOptions(response.availability) }).catch(() => { setWorkerRoles([{ value: 'other', label: 'Other hospitality or domestic role' }]); setAvailabilityOptions([{ value: 'immediate', label: 'Immediate' }, { value: 'full_time', label: 'Full time' }, { value: 'weekends', label: 'Weekends' }]) })
  }, [])

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const normalizedPhone = normalizeKenyanPhone(form.phone)
    if (!normalizedPhone) { setError('Please enter a valid Kenyan mobile number.'); setSaving(false); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters long.'); setSaving(false); return }
    if (form.password !== form.confirm_password) { setError('Passwords do not match.'); setSaving(false); return }
    if (!termsAccepted) { setError('Please accept the terms and conditions to continue.'); setSaving(false); return }
    if (!privacyAccepted) { setError('Please accept the privacy policy to continue.'); setSaving(false); return }

    try {
      const payload: Record<string, unknown> = { phone: normalizedPhone, full_name: form.full_name.trim(), password: form.password, role }
      if (form.email.trim()) payload.email = form.email.trim()
      if (form.referral_code.trim()) payload.referral_code = form.referral_code.trim().toUpperCase()
      if (role === 'worker') {
        if (!form.primary_role.trim() || !form.location.trim() || !form.bio.trim() || !form.expected_daily_rate_ksh) { setError('Complete all required worker details.'); setSaving(false); return }
        payload.primary_role = form.primary_role.trim(); payload.location = form.location.trim(); payload.availability = form.availability; payload.expected_daily_rate_ksh = Number(form.expected_daily_rate_ksh); payload.bio = form.bio.trim()
      } else {
        if (!form.contact_person.trim()) { setError('Contact person name is required for employers.'); setSaving(false); return }
        payload.contact_person = form.contact_person.trim()
      }
      const response = await register(payload)
      navigate(`/verify-phone?phone=${encodeURIComponent(normalizedPhone)}${response.verification_code ? `&code=${response.verification_code}` : ''}`)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to create your account.')
    } finally { setSaving(false) }
  }

  return <AuthPanel eyebrow="Join KaziLink" title="Create your account" subtitle="Start hiring faster or find work faster with a trusted Kenyan recruitment community."><FormSection title="Your profile" description="Set up your worker or employer account and verify the details that matter most."><div className="pb-24 sm:pb-0"><form id="register-form" className="space-y-5" onSubmit={submit}><div className="rounded-2xl border border-slate-200 bg-slate-50 p-1"><div className="grid grid-cols-2 gap-1" role="group" aria-label="Account type"><button type="button" onClick={() => setRole('worker')} className={`rounded-xl px-3 py-2.5 text-sm font-bold ${role === 'worker' ? 'bg-[#0A2540] text-white' : 'text-slate-600 hover:bg-white'}`}>Worker</button><button type="button" onClick={() => setRole('employer')} className={`rounded-xl px-3 py-2.5 text-sm font-bold ${role === 'employer' ? 'bg-[#FF6B00] text-white' : 'text-slate-600 hover:bg-white'}`}>Employer</button></div></div><AuthField label="Full name" required value={form.full_name} onChange={(event) => update('full_name', event.target.value)} /><AuthField label="Phone number" required type="tel" inputMode="tel" autoComplete="tel" placeholder="0712 345 678 or +254 7XX XXX XXX" value={form.phone} onChange={(event) => update('phone', event.target.value)} helperText={isValidKenyanPhone(form.phone) ? `Standard format: ${normalizeKenyanPhone(form.phone)}` : 'Use a Kenyan mobile number'} /><AuthField label="Email" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} /><AuthField label="Password" required minLength={8} type="password" autoComplete="new-password" value={form.password} onChange={(event) => update('password', event.target.value)} /><PasswordStrengthBar password={form.password} /><AuthField label="Confirm password" required minLength={8} type="password" autoComplete="new-password" value={form.confirm_password} onChange={(event) => update('confirm_password', event.target.value)} helperText={form.confirm_password ? form.password === form.confirm_password ? 'Passwords match' : 'Passwords do not match yet' : undefined} /><AuthField label="Referral code" value={form.referral_code} onChange={(event) => update('referral_code', event.target.value)} placeholder="KAZI-XXXXXXXX" />{role === 'worker' ? <><Select label="Primary role" required searchable value={form.primary_role} onChange={(value) => update('primary_role', value)} options={workerRoles} /><AuthField label="Location" required value={form.location} onChange={(event) => update('location', event.target.value)} /><Select label="Availability" searchable value={form.availability} onChange={(value) => update('availability', value)} options={availabilityOptions} /><AuthField label="Expected daily rate (KSh)" required type="number" min="0" value={form.expected_daily_rate_ksh} onChange={(event) => update('expected_daily_rate_ksh', event.target.value)} /><AuthField label="Short bio" required multiline rows={4} value={form.bio} onChange={(event) => update('bio', event.target.value)} /></> : <AuthField label="Contact person" required value={form.contact_person} onChange={(event) => update('contact_person', event.target.value)} />}{error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700">{error}</div>}<Checkbox checked={termsAccepted} onChange={setTermsAccepted} label={<span>I agree to the <Link className="text-[#0A2540] underline decoration-[#FF6B00] underline-offset-2" to="/terms">Terms of Service</Link></span>} /><Checkbox checked={privacyAccepted} onChange={setPrivacyAccepted} label={<span>I agree to the <Link className="text-[#0A2540] underline decoration-[#FF6B00] underline-offset-2" to="/privacy">Privacy Policy</Link></span>} description="You agree to KaziLink's platform rules and privacy practices." /></form></div><div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/90 px-3 py-2.5 backdrop-blur-sm sm:static sm:border-0 sm:bg-transparent sm:px-0 sm:pt-4"><FormActions submitLabel={saving ? 'Creating account...' : 'Create account'} loading={saving} align="center" className="border-t-0 pt-0" fullWidth disabled={!termsAccepted || !privacyAccepted} formId="register-form" /><div className="mt-2 text-center text-sm text-slate-600"><Link className="font-semibold text-[#0A2540] hover:text-[#FF6B00]" to="/login">Already have an account?</Link></div></div></FormSection></AuthPanel>
}
