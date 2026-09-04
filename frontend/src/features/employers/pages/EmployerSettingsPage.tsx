import { Bell, Briefcase, KeyRound, ShieldCheck, UserCircle2 } from 'lucide-react'
import { useState } from 'react'

import { FormField, FormSection } from '../../../shared/components/forms'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Select } from '../../../shared/components/ui/Select'
import { Switch } from '../../../shared/components/ui/Switch'
import { useAuthStore } from '../../auth/store'

export function EmployerSettingsPage() {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState({ shifts: true, messages: true, payments: true })
  const [securityEnabled, setSecurityEnabled] = useState(true)

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader eyebrow="Employer account" title="Settings & preferences" actions={<div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100"><ShieldCheck className="h-3.5 w-3.5 text-[#FF6B00]" />Secure profile</div>} />
      <div className="space-y-6">
        <FormSection title="Account details" description="Review the account identity connected to your employer profile." icon={<UserCircle2 className="h-4 w-4" />}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Full name" required><Input value={user?.full_name || 'Not available'} readOnly /></FormField>
            <FormField label="Phone number" required><Input value={user?.phone || 'Not provided'} readOnly /></FormField>
            <FormField label="Email address"><Input value={user?.email || 'Not provided'} readOnly /></FormField>
            <Select label="Primary role" value="employer" onChange={() => undefined} options={[{ value: 'employer', label: 'Employer' }]} disabled />
          </div>
        </FormSection>
        <FormSection title="Security" description="Control access and protection for your employer account." icon={<KeyRound className="h-4 w-4" />}>
          <div className="space-y-5"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><Switch checked={securityEnabled} onChange={setSecurityEnabled} label="Two-step verification" description="Require an additional verification step for sensitive account actions." /></div><div className="grid gap-4 md:grid-cols-2"><FormField label="Current password"><Input type="password" placeholder="Enter current password" /></FormField><FormField label="New password"><Input type="password" placeholder="Enter a new password" /></FormField></div></div>
        </FormSection>
        <FormSection title="Employer notifications" description="Choose the updates that matter to your hiring workflow." icon={<Bell className="h-4 w-4" />}>
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"><Switch checked={notifications.shifts} onChange={(value) => setNotifications((current) => ({ ...current, shifts: value }))} label="Candidate and shift alerts" description="Receive updates for applications and matched talent." /><Switch checked={notifications.messages} onChange={(value) => setNotifications((current) => ({ ...current, messages: value }))} label="Messages" description="Get updates when workers reach out to you." /><Switch checked={notifications.payments} onChange={(value) => setNotifications((current) => ({ ...current, payments: value }))} label="Payments and payouts" description="Track transaction and payout confirmations." /></div>
        </FormSection>
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-sm text-slate-600"><Briefcase className="h-4 w-4 text-[#FF6B00]" />Your employer account is active.</div><div className="flex gap-3"><Button variant="outline" type="button">Cancel</Button><Button type="button">Save settings</Button></div></div>
      </div>
    </section>
  )
}
