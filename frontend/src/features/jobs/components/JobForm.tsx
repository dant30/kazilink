import type { FormEvent } from 'react'

import { FormActions, FormField, FormSection, ValidationErrors } from '../../../shared/components/forms'
import { Select } from '../../../shared/components/ui/Select'

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
      <FormSection title="Role details" description="Define the role, compensation, and expectations for applicants." icon={<span className="text-xs font-black">1</span>} divider={false}>
        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Title" required>
            <input
              required
              value={values.title}
              onChange={(event) => onChange('title', event.target.value)}
              placeholder="e.g. Senior Waiter"
              className={fieldClass}
            />
          </FormField>

          <FormField label="Category" required>
            <input
              required
              value={values.category}
              onChange={(event) => onChange('category', event.target.value)}
              placeholder="Hospitality"
              className={fieldClass}
            />
          </FormField>

          <FormField label="Location" required>
            <input
              required
              value={values.location}
              onChange={(event) => onChange('location', event.target.value)}
              placeholder="Nairobi"
              className={fieldClass}
            />
          </FormField>

          <FormField label="Pay amount" required>
            <input
              required
              min="1"
              type="number"
              value={values.pay_amount_ksh}
              onChange={(event) => onChange('pay_amount_ksh', event.target.value)}
              placeholder="25000"
              className={fieldClass}
            />
          </FormField>

          <FormField label="Pay period" required>
            <input
              required
              value={values.pay_period}
              onChange={(event) => onChange('pay_period', event.target.value)}
              placeholder="per month"
              className={fieldClass}
            />
          </FormField>

          <Select label="Job type" required value={values.job_type} onChange={(value) => onChange('job_type', value)} options={[{ value: 'full_time', label: 'Full time' }, { value: 'part_time', label: 'Part time' }, { value: 'weekend_gig', label: 'Weekend gig' }, { value: 'daily_shift', label: 'Daily shift' }, { value: 'shift_24hr', label: '24-hour shift' }]} />
        </div>

        <FormField label="Description" required>
          <textarea
            required
            value={values.description}
            onChange={(event) => onChange('description', event.target.value)}
            placeholder="Describe the role, responsibilities, schedule, and key expectations."
            rows={6}
            className={`${fieldClass} resize-none`}
          />
        </FormField>
      </FormSection>

      <ValidationErrors errors={error ? [error] : null} />
      <FormActions submitLabel={saving ? 'Posting...' : 'Post job'} loading={saving} />
    </form>
  )
}