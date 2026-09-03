import { FormEvent, useState } from 'react'
import { CreditCard } from 'lucide-react'
import { FormActions, FormField, FormSection } from '../../../shared/components/forms'
import { Input } from '../../../shared/components/ui/Input'
import { Select } from '../../../shared/components/ui/Select'
import type { PaymentInitiateInput } from '../types'

const types = [{ value: 'history_unlock', label: 'Employment history unlock' }, { value: 'bundle', label: 'Profile unlock bundle' }, { value: 'featured_job', label: 'Featured job' }]

export function PaymentForm({ onSubmit, submitting, defaultPhone }: { onSubmit: (data: PaymentInitiateInput) => Promise<unknown>; submitting?: boolean; defaultPhone?: string }) {
  const [form, setForm] = useState<PaymentInitiateInput>({ transaction_type: types[0].value, amount_ksh: 0, phone_number: defaultPhone || '' })
  const submit = async (event: FormEvent) => { event.preventDefault(); await onSubmit(form) }
  return <form id="payment-form" onSubmit={submit}><FormSection title="Make a payment" description="A secure M-Pesa prompt will be sent to your phone." icon={<CreditCard className="h-4 w-4" />} divider={false}><Select label="Payment purpose" required value={form.transaction_type} onChange={(value) => setForm({ ...form, transaction_type: value })} options={types} /><FormField label="Amount (KSh)" required><Input required type="number" min={1} value={form.amount_ksh || ''} onChange={(event) => setForm({ ...form, amount_ksh: Number(event.target.value) })} /></FormField><FormField label="M-Pesa phone number" required><Input required value={form.phone_number || ''} onChange={(event) => setForm({ ...form, phone_number: event.target.value })} placeholder="2547XXXXXXXX" /></FormField></FormSection><FormActions formId="payment-form" submitLabel="Send payment prompt" loading={submitting} disabled={form.amount_ksh < 1} /></form>
}
