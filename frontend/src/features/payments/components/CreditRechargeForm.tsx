import { FormEvent, useEffect, useRef, useState } from 'react'
import { CreditCard } from 'lucide-react'
import { endpoints } from '../../../core/api'
import { toast } from '../../../shared/components/feedback'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'

export function CreditRechargeForm({ defaultPhone, onComplete, onCancel }: { defaultPhone?: string; onComplete: () => void; onCancel?: () => void }) {
  const [amount, setAmount] = useState(100)
  const [phoneNumber, setPhoneNumber] = useState(defaultPhone || '')
  const [rate, setRate] = useState(50)
  const [minimumRecharge, setMinimumRecharge] = useState(100)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'pending' | 'completed' | 'failed'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const cancelledRef = useRef(false)

  useEffect(() => () => { cancelledRef.current = true }, [])

  useEffect(() => {
    endpoints.credits.catalog().then((catalog) => {
      setRate(catalog.ksh_per_credit)
      setMinimumRecharge(catalog.minimum_recharge_ksh)
      setAmount(catalog.minimum_recharge_ksh)
    }).catch(() => undefined)
  }, [])

  const wait = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

  const pollRecharge = async (rechargeId: number) => {
    const maximumAttempts = 24
    for (let attempt = 0; attempt < maximumAttempts && !cancelledRef.current; attempt += 1) {
      if (attempt > 0) await wait(3000)
      if (cancelledRef.current) return
      try {
        const recharge = await endpoints.credits.rechargeStatus(rechargeId)
        if (recharge.status === 'completed') {
          setStatus('completed')
          setStatusMessage(`${recharge.credits} Kazi Credits have been added to your wallet.`)
          onComplete()
          return
        }
        if (recharge.status === 'failed') {
          setStatus('failed')
          setStatusMessage('M-Pesa did not complete this recharge. No credits were added.')
          return
        }
      } catch {}
    }
    if (!cancelledRef.current) {
      setStatus('pending')
      setStatusMessage('We are still waiting for M-Pesa confirmation. You can close this window and check your wallet later.')
    }
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setStatus('pending')
    setStatusMessage('Approve the M-Pesa prompt on your phone. We will update this window automatically.')
    try {
      const recharge = await endpoints.credits.recharge({ amount_ksh: amount, phone_number: phoneNumber || undefined })
      toast.success('M-Pesa prompt sent', `Complete the prompt to receive ${recharge.credits} Kazi Credits.`)
      await pollRecharge(recharge.id)
    } catch (error) {
      setStatus('failed')
      setStatusMessage(error instanceof Error ? error.message : 'Unable to start the recharge.')
      toast.error('Recharge failed', error instanceof Error ? error.message : 'Unable to start the recharge.')
    } finally {
      setSubmitting(false)
    }
  }

  return <form onSubmit={submit} className="space-y-4">
    {status !== 'idle' && <div className={`rounded-xl border p-3 text-sm ${status === 'completed' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : status === 'failed' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-sky-200 bg-sky-50 text-sky-800'}`}><strong>{status === 'pending' ? 'Waiting for confirmation' : status === 'completed' ? 'Recharge complete' : 'Recharge failed'}</strong><p className="mt-1">{statusMessage}</p></div>}
    {status === 'idle' && <>
      <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 text-sm text-slate-700"><strong>{amount > 0 ? Math.floor(amount / rate) : 0} Kazi Credits</strong> will be added after successful M-Pesa confirmation.</div>
      <label className="block text-sm font-semibold text-slate-700">Recharge amount (KSh)<Input required type="number" min={minimumRecharge} step={rate} value={amount} onChange={(event) => setAmount(Number(event.target.value))} /><span className="mt-1 block text-xs font-normal text-slate-500">Minimum KSh {minimumRecharge} = {minimumRecharge / rate} Kazi Credits.</span></label>
      <label className="block text-sm font-semibold text-slate-700">M-Pesa phone number<Input required value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="2547XXXXXXXX" /></label>
      <Button type="submit" className="w-full" disabled={submitting || amount < minimumRecharge || amount % rate !== 0} isLoading={submitting} leftIcon={<CreditCard className="h-4 w-4" />}>Recharge wallet</Button>
    </>}
    {status === 'pending' && onCancel && <Button type="button" variant="outline" className="w-full" onClick={onCancel}>Close and refresh later</Button>}
  </form>
}