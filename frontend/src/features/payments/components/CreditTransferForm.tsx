import { FormEvent, useState } from 'react'
import { ArrowRightLeft, Phone, Send } from 'lucide-react'
import { endpoints } from '../../../core/api'
import { normalizeKenyanPhone } from '../../../core/utils'
import { toast } from '../../../shared/components/feedback'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'

function createIdempotencyKey() {
  return typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `credit-transfer-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function CreditTransferForm({ balance, onComplete }: { balance: number; onComplete: () => void }) {
  const [recipientPhone, setRecipientPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState('')

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const normalizedPhone = normalizeKenyanPhone(recipientPhone)
    const transferAmount = Number(amount)
    if (!normalizedPhone) {
      setValidationError('Enter a valid Kenyan mobile number.')
      return
    }
    if (!Number.isInteger(transferAmount) || transferAmount < 1) {
      setValidationError('Enter a whole number of credits greater than zero.')
      return
    }
    if (transferAmount > balance) {
      setValidationError(`You can transfer up to ${balance} credit${balance === 1 ? '' : 's'}.`)
      return
    }

    setSubmitting(true)
    setValidationError('')
    try {
      await endpoints.credits.transfer({ recipient_phone: normalizedPhone, amount: transferAmount, idempotency_key: createIdempotencyKey() })
      toast.success('Credits transferred', `${transferAmount} credit${transferAmount === 1 ? '' : 's'} sent successfully.`)
      onComplete()
    } catch (error) {
      toast.error('Transfer failed', error instanceof Error ? error.message : 'Unable to transfer credits.')
    } finally {
      setSubmitting(false)
    }
  }

  return <form onSubmit={submit} className="space-y-4">
    <div className="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50 p-3 text-sm text-sky-900"><ArrowRightLeft className="mt-0.5 h-4 w-4 shrink-0" /><p>Transfer credits to an active KaziLink account. Transfers are immediate and cannot be reversed.</p></div>
    <Input label="Recipient phone number" required value={recipientPhone} onChange={(event) => { setRecipientPhone(event.target.value); setValidationError('') }} placeholder="0712 345 678" leftIcon={<Phone className="h-4 w-4" />} helperText="Use the phone number linked to the recipient's KaziLink account." />
    <Input label="Credits to transfer" required type="number" min="1" max={Math.max(1, balance)} step="1" value={amount} onChange={(event) => { setAmount(event.target.value); setValidationError('') }} placeholder="5" helperText={`Available balance: ${balance} Kazi Credits.`} />
    {validationError && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{validationError}</p>}
    <Button type="submit" className="w-full" disabled={submitting || balance < 1} isLoading={submitting} leftIcon={<Send className="h-4 w-4" />}>Transfer credits</Button>
  </form>
}