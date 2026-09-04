import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, MessageSquareText } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../../../shared/components/ui/Button'
import { AuthField, AuthPanel } from '../components'
import { passwordResetStore, usePasswordResetStore } from '../store/passwordResetStore'

export function ForgotPasswordPage() {
  const state = usePasswordResetStore()
  const [phone, setPhone] = useState(state.phone)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => setPhone(state.phone), [state.phone])

  if (state.step === 'complete') return <CompleteStep />

  return (
    <AuthPanel eyebrow="Account access" title="Reset your password" subtitle="Recover your KaziLink account securely with a one-time code.">
      {state.step === 'request' && <RequestStep phone={phone} setPhone={setPhone} loading={state.loading} error={state.error} />}
      {state.step === 'verify' && <VerifyStep phone={state.phone} code={code} setCode={setCode} loading={state.loading} error={state.error} verificationCode={state.verificationCode} />}
      {state.step === 'confirm' && <ConfirmStep newPassword={newPassword} setNewPassword={setNewPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} showPassword={showPassword} setShowPassword={setShowPassword} loading={state.loading} error={state.error} />}
    </AuthPanel>
  )
}

function RequestStep({ phone, setPhone, loading, error }: { phone: string; setPhone: (value: string) => void; loading: boolean; error: string }) {
  const submit = async (event: FormEvent) => { event.preventDefault(); if (phone.trim()) await passwordResetStore.request(phone.trim()).catch(() => undefined) }
  return <form className="space-y-5" onSubmit={submit}>
    <div className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900"><MessageSquareText className="mt-0.5 h-5 w-5 shrink-0" /><p>We will send a reset code by SMS if an account exists for this phone number.</p></div>
    <AuthField label="Phone number" required autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="07xx xxx xxx" />
    {error && <ErrorMessage message={error} />}
    <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>{loading ? 'Sending code...' : 'Send reset code'}</Button>
    <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-semibold text-[#0A2540] hover:text-[#FF6B00]"><ArrowLeft className="h-4 w-4" />Back to sign in</Link>
  </form>
}

function VerifyStep({ phone, code, setCode, loading, error, verificationCode }: { phone: string; code: string; setCode: (value: string) => void; loading: boolean; error: string; verificationCode?: string }) {
  const submit = async (event: FormEvent) => { event.preventDefault(); if (code.trim()) await passwordResetStore.verify(code.trim()).catch(() => undefined) }
  return <form className="space-y-5" onSubmit={submit}>
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Enter the code sent to <strong className="text-slate-900">{phone}</strong>.</div>
    {verificationCode && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Development code: <strong>{verificationCode}</strong></div>}
    <AuthField label="Reset code" required inputMode="numeric" maxLength={8} value={code} onChange={(event) => setCode(event.target.value)} autoComplete="one-time-code" />
    {error && <ErrorMessage message={error} />}
    <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>{loading ? 'Checking code...' : 'Verify code'}</Button>
    <div className="flex items-center justify-between gap-3 text-sm"><button type="button" onClick={() => passwordResetStore.reset()} className="flex items-center gap-2 font-semibold text-slate-600 hover:text-[#0A2540]"><ArrowLeft className="h-4 w-4" />Change phone</button><button type="button" onClick={() => passwordResetStore.request(phone)} disabled={loading} className="font-semibold text-[#FF6B00] hover:text-[#E55F00]">Resend code</button></div>
  </form>
}

function ConfirmStep({ newPassword, setNewPassword, confirmPassword, setConfirmPassword, showPassword, setShowPassword, loading, error }: { newPassword: string; setNewPassword: (value: string) => void; confirmPassword: string; setConfirmPassword: (value: string) => void; showPassword: boolean; setShowPassword: (value: boolean) => void; loading: boolean; error: string }) {
  const submit = async (event: FormEvent) => { event.preventDefault(); await passwordResetStore.confirm(newPassword, confirmPassword).catch(() => undefined) }
  return <form className="space-y-5" onSubmit={submit}>
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><KeyRound className="mt-0.5 h-5 w-5 shrink-0" /><p>Code verified. Choose a strong new password with at least 8 characters.</p></div>
    <div className="relative"><AuthField label="New password" required type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-slate-400 hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
    <AuthField label="Confirm new password" required type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
    {error && <ErrorMessage message={error} />}
    <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>{loading ? 'Updating password...' : 'Update password'}</Button>
    <button type="button" onClick={() => passwordResetStore.reset()} className="mx-auto flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0A2540]"><ArrowLeft className="h-4 w-4" />Use another code</button>
  </form>
}

function CompleteStep() {
  return <AuthPanel eyebrow="Password updated" title="You are back in control" subtitle="Your password has been changed successfully."><div className="space-y-5 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-7 w-7" /></div><p className="text-sm leading-6 text-slate-600">Use your new password to sign in to KaziLink.</p><Link to="/login" className="block"><Button variant="navy" size="lg" className="w-full">Return to sign in</Button></Link></div></AuthPanel>
}

function ErrorMessage({ message }: { message: string }) {
  return <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />{message}</div>
}
