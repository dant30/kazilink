import { useState, type FormEvent } from 'react'
import { CreditCard, RefreshCw } from 'lucide-react'
import { FormActions, FormField, FormSection } from '../../../shared/components/forms'
import { Button } from '../../../shared/components/ui/Button'
import { Input } from '../../../shared/components/ui/Input'
import { Modal } from '../../../shared/components/ui/Modal'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { useAuthStore } from '../../auth/store'
import { SubscriptionHistory, SubscriptionPlanCard } from '../components'
import { useSubscriptions } from '../hooks/useSubscriptions'

export function SubscriptionsPage() {
  const { user } = useAuthStore()
  const isEmployer = Boolean(user?.is_employer && !user?.is_worker)
  const { plans, subscriptions, loading, processing, error, notice, refresh, checkout, cancel } = useSubscriptions({ enabled: isEmployer })
  const [phone, setPhone] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const current = subscriptions.find((item) => item.status === 'active')
  const choose = (plan: string) => setSelectedPlan(plan)
  const confirmCheckout = async (event: FormEvent) => { event.preventDefault(); if (!selectedPlan) return; await checkout(selectedPlan, phone || user?.phone || '').catch(() => undefined); setSelectedPlan(null) }
  if (!isEmployer) return <section className="mx-auto max-w-3xl px-4 py-16 text-center"><h1 className="text-2xl font-black text-[#0A2540]">Employer subscriptions only</h1><p className="mt-2 text-sm text-slate-500">Subscriptions are available for employer accounts.</p></section>
  if (loading && !plans.length) return <section className="mx-auto max-w-6xl space-y-4 px-4 py-8" aria-label="Loading subscription plans" aria-busy="true"><Skeleton className="h-12 w-64 rounded-2xl" />{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-56 rounded-2xl" />)}</section>
  return <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <PageHeader
      eyebrow="Employer billing"
      title="Subscriptions"
      description="Choose the hiring capacity that fits your team. Payments are confirmed through your phone."
      icon={<CreditCard className="h-5 w-5" />}
    />
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}{notice && <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">{notice}</div>}
    <section className="space-y-4"><div><h2 className="text-xl font-black text-[#0A2540]">Plans</h2><p className="text-sm text-slate-500">Prices and duration are provided by the server.</p></div><div className="grid gap-4 md:grid-cols-3">{plans.map((plan) => <SubscriptionPlanCard key={plan.code} plan={plan} current={current?.plan === plan.code} processing={processing && selectedPlan === plan.code} onChoose={() => choose(plan.code)} />)}</div></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="font-black text-[#0A2540]">Subscription history</h2><p className="text-sm text-slate-500">Review active and previous plans.</p></div><Button variant="ghost" size="sm" onClick={() => refresh()} disabled={loading} leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button></div><SubscriptionHistory subscriptions={subscriptions} processing={processing} onCancel={cancel} /></section><Modal isOpen={Boolean(selectedPlan)} onClose={() => setSelectedPlan(null)} title="Confirm subscription" subtitle="Your payment prompt will be sent by M-Pesa." maxWidth="md"><form id="subscription-checkout-form" onSubmit={confirmCheckout}><FormSection title={plans.find((plan) => plan.code === selectedPlan)?.name || 'Selected plan'} description="Confirm the phone number for this payment." icon={<CreditCard className="h-4 w-4" />} divider={false}><FormField label="Payment phone number" required><Input required value={phone} onChange={(event) => setPhone(event.target.value)} placeholder={user?.phone || '2547XXXXXXXX'} /></FormField></FormSection><FormActions formId="subscription-checkout-form" submitLabel="Send payment prompt" loading={processing} /></form></Modal>
  </section>
}