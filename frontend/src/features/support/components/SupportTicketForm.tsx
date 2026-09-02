import { FormEvent, useState } from 'react'
import { Send } from 'lucide-react'
import { FormActions, FormField, FormSection } from '../../../shared/components/forms'
import { Input } from '../../../shared/components/ui/Input'
import type { SupportTicketInput } from '../types'

export function SupportTicketForm({ onSubmit, submitting }: { onSubmit: (data: SupportTicketInput) => Promise<unknown>; submitting?: boolean }) {
  const [form, setForm] = useState<SupportTicketInput>({ subject: '', description: '' })
  const submit = async (event: FormEvent) => { event.preventDefault(); await onSubmit(form); setForm({ subject: '', description: '' }) }
  return <form id="support-ticket-form" onSubmit={submit}><FormSection title="Contact support" description="Tell us what happened and our team will review it." icon={<Send className="h-4 w-4" />} divider={false}><FormField label="Subject" required><Input required maxLength={255} value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder="What do you need help with?" /></FormField><FormField label="Description" required><textarea required maxLength={5000} rows={5} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Share the relevant details..." className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100" /></FormField></FormSection><FormActions formId="support-ticket-form" submitLabel="Submit ticket" loading={submitting} /></form>
}
