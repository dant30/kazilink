import { Bell, Briefcase, KeyRound, ShieldCheck, UserCircle2 } from 'lucide-react'
import { useState } from 'react'

import { FormField, FormSection } from '../../../shared/components/forms'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Select } from '../../../shared/components/ui/Select'
import { Switch } from '../../../shared/components/ui/Switch'
import { useAuthStore } from '../../auth/store'

export function AccountSettingsPage() {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState({ shifts: true, messages: true, payments: true })
  const [securityEnabled, setSecurityEnabled] = useState(true)

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Account"
        title="Settings & preferences"
        actions={
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100 backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-[#FF6B00]" />
            Secure profile
          </div>
        }
      />

      <div className="space-y-6">
        <FormSection title="Profile details" description="Keep your public and account information current." icon={<UserCircle2 className="h-4 w-4" />}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Full name" required>
              <Input value={user?.full_name || 'Not available'} readOnly />
            </FormField>
            <FormField label="Phone number" required>
              <Input value={user?.phone || 'Not provided'} readOnly />
            </FormField>
            <FormField label="Email address">
              <Input value={user?.email || 'Not provided'} readOnly />
            </FormField>
            <FormField label="Primary role">
              <Select
                value={user?.is_worker && user?.is_employer ? 'worker-employer' : user?.is_worker ? 'worker' : user?.is_employer ? 'employer' : 'user'}
                onChange={() => undefined}
                options={[
                  { value: 'worker', label: 'Worker' },
                  { value: 'employer', label: 'Employer' },
                  { value: 'worker-employer', label: 'Worker + Employer' },
                  { value: 'user', label: 'General user' },
                ]}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Security" description="Control access and protection for your KaziLink account." icon={<KeyRound className="h-4 w-4" />}>
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Switch
                checked={securityEnabled}
                onChange={setSecurityEnabled}
                label="Two-step verification"
                description="Require a second verification step for higher-risk logins and account changes."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Current password">
                <Input type="password" placeholder="••••••••" />
              </FormField>
              <FormField label="New password">
                <Input type="password" placeholder="Enter a new password" />
              </FormField>
            </div>
          </div>
        </FormSection>

        <FormSection title="Notifications" description="Choose the updates you want to receive from the platform." icon={<Bell className="h-4 w-4" />}>
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Switch
              checked={notifications.shifts}
              onChange={(value) => setNotifications((current) => ({ ...current, shifts: value }))}
              label="Shift alerts"
              description="Receive notifications for newly matched or available shifts."
            />
            <Switch
              checked={notifications.messages}
              onChange={(value) => setNotifications((current) => ({ ...current, messages: value }))}
              label="Messages"
              description="Get updates when employers or workers reach out to you."
            />
            <Switch
              checked={notifications.payments}
              onChange={(value) => setNotifications((current) => ({ ...current, payments: value }))}
              label="Payments and payouts"
              description="Track milestones, transaction updates, and payout confirmations."
            />
          </div>
        </FormSection>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Briefcase className="h-4 w-4 text-[#FF6B00]" />
            Your account is active and visible in verified marketplace listings.
          </div>
          <div className="flex gap-3">
            <Button variant="outline" type="button">Cancel</Button>
            <Button type="button">Save settings</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
