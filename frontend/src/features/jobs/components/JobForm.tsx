import type { FormEvent } from 'react'

import { Button } from '../../../shared/components/ui/Button'

export type JobFormValues = {
  title: string
  category: string
  location: string
  job_type: string
  pay_amount_ksh: string
  pay_period: string
  description: string
}

export function JobForm({
  values,
  saving,
  error,
  onChange,
  onSubmit,
}: {
  values: JobFormValues
  saving: boolean
  error: string
  onChange: (key: keyof JobFormValues, value: string) => void
  onSubmit: (event: FormEvent) => void
}) {
  const fieldClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#FF6B00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFB380]'

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          <span>Title</span>
          <input
            required
            value={values.title}
            onChange={(event) => onChange('title', event.target.value)}
            placeholder="e.g. Senior Waiter"
            className={fieldClass}
          />
        </label>

        <label className="space-y-2 text-sm font-semibold text-slate-700">
          <span>Category</span>
          <input
            required
            value={values.category}
            onChange={(event) => onChange('category', event.target.value)}
            placeholder="Hospitality"
            className={fieldClass}
          />
        </label>

        <label className="space-y-2 text-sm font-semibold text-slate-700">
          <span>Location</span>
          <input
            required
            value={values.location}
            onChange={(event) => onChange('location', event.target.value)}
            placeholder="Nairobi"
            className={fieldClass}
          />
        </label>

        <label className="space-y-2 text-sm font-semibold text-slate-700">
          <span>Pay amount</span>
          <input
            required
            min="1"
            type="number"
            value={values.pay_amount_ksh}
            onChange={(event) => onChange('pay_amount_ksh', event.target.value)}
            placeholder="25000"
            className={fieldClass}
          />
        </label>

        <label className="space-y-2 text-sm font-semibold text-slate-700">
          <span>Pay period</span>
          <input
            required
            value={values.pay_period}
            onChange={(event) => onChange('pay_period', event.target.value)}
            placeholder="per month"
            className={fieldClass}
          />
        </label>

        <label className="space-y-2 text-sm font-semibold text-slate-700">
          <span>Job type</span>
          <select
            value={values.job_type}
            onChange={(event) => onChange('job_type', event.target.value)}
            className={fieldClass}
          >
            <option value="full_time">Full time</option>
            <option value="part_time">Part time</option>
            <option value="weekend_gig">Weekend gig</option>
            <option value="daily_shift">Daily shift</option>
            <option value="shift_24hr">24-hour shift</option>
          </select>
        </label>
      </div>

      <label className="block space-y-2 text-sm font-semibold text-slate-700">
        <span>Description</span>
        <textarea
          required
          value={values.description}
          onChange={(event) => onChange('description', event.target.value)}
          placeholder="Describe the role, responsibilities, schedule, and key expectations."
          rows={6}
          className={`${fieldClass} resize-none`}
        />
      </label>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="lg" isLoading={saving} className="min-w-[180px]">
          {saving ? 'Posting...' : 'Post job'}
        </Button>
      </div>
    </form>
  )
}