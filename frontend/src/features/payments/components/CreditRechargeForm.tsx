import { FormEvent, useEffect, useState } from 'react'
import { CreditCard } from 'lucide-react'
import { endpoints } from '../../../core/api'
import { toast } from '../../../shared/components/feedback'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'

export function CreditRechargeForm({ defaultPhone, onComplete }: { defaultPhone?: string; onComplete: () => void }) {
  const [amount, setAmount] = useState(100)
  const [phoneNumber, setPhoneNumber] = useState(defaultPhone || '')
  const [rate, setRate] = useState(50)
  const [minimumRecharge, setMinimumRecharge] = useState(100)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    endpoints.credits.catalog().then((catalog) => {
      setRate(catalog.ksh_per_credit)
      setMinimumRecharge(catalog.minimum_recharge_ksh)
      setAmount(catalog.minimum_recharge_ksh)
    }).catch(() => undefined)
  }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await endpoints.credits.recharge({ amount_ksh: amount, phone_number: phoneNumber || undefined })
      toast.success('Recharge requested', `Complete the M-Pesa prompt to receive ${Math.floor(amount / rate)} Kazi Credits.`)
      onComplete()
    } catch (error) {
      toast.error('Recharge failed', error instanceof Error ? error.message : 'Unable to start the recharge.')
    } finally {
      setSubmitting(false)
    }
  }

  return <form onSubmit={submit} className="space-y-4">
    <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 text-sm text-slate-700"><strong>{amount > 0 ? Math.floor(amount / rate) : 0} Kazi Credits</strong> will be added after successful M-Pesa confirmation.</div>
    <label className="block text-sm font-semibold text-slate-700">Recharge amount (KSh)<Input required type="number" min={minimumRecharge} step={rate} value={amount} onChange={(event) => setAmount(Number(event.target.value))} /><span className="mt-1 block text-xs font-normal text-slate-500">Minimum KSh {minimumRecharge} = {minimumRecharge / rate} Kazi Credits.</span></label>
    <label className="block text-sm font-semibold text-slate-700">M-Pesa phone number<Input required value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="2547XXXXXXXX" /></label>
    <Button type="submit" className="w-full" disabled={submitting || amount < minimumRecharge || amount % rate !== 0} isLoading={submitting} leftIcon={<CreditCard className="h-4 w-4" />}>Recharge wallet</Button>
  </form>
}