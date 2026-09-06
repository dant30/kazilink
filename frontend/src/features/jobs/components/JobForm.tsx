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
  shift_times: string
  requirements: string
  benefits: string
  required_skills: string[]
  minimum_experience_years: string
  description: string
}

export type JobFormOptions = {
  categories: Array<{ value: string; label: string }>
  locations: Array<{ value: string; label: string }>
  jobTypes: Array<{ value: string; label: string }>
  payPeriods: Array<{ value: string; label: string }>
  skills: Array<{ value: string; label: string }>
}

export function JobForm({
  values,
  saving,
  error,
  options,
  onChange,
  onSubmit,
  submitLabel = 'Post job',
}: {
  values: JobFormValues
  saving: boolean
  error: string
  options: JobFormOptions
  onChange: (key: keyof JobFormValues, value: string | string[]) => void
  onSubmit: (event: FormEvent) => void
  submitLabel?: string
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
            <Select searchable required value={values.category} onChange={(value) => onChange('category', value)} options={[{ value: '', label: 'Select category' }, ...options.categories]} />
          </FormField>

          <FormField label="Location" required>
            <Select searchable required value={values.location} onChange={(value) => onChange('location', value)} options={[{ value: '', label: 'Select location' }, ...options.locations]} />
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
            <Select searchable required value={values.pay_period} onChange={(value) => onChange('pay_period', value)} options={[{ value: '', label: 'Select pay period' }, ...options.payPeriods]} />
          </FormField>

          <Select searchable label="Job type" required value={values.job_type} onChange={(value) => onChange('job_type', value)} options={[{ value: '', label: 'Select job type' }, ...options.jobTypes]} />

          <FormField label="Shift times">
            <input value={values.shift_times} onChange={(event) => onChange('shift_times', event.target.value)} placeholder="e.g. 8:00 AM - 5:00 PM, Monday to Friday" className={fieldClass} />
          </FormField>

          <FormField label="Minimum experience" helperText="Set 0 for entry-level roles.">
            <input type="number" min="0" value={values.minimum_experience_years} onChange={(event) => onChange('minimum_experience_years', event.target.value)} placeholder="0" className={fieldClass} />
          </FormField>

          <FormField label="Required skills" helperText="Search and add skills from the worker catalog.">
            <Select searchable value="" onChange={(value) => { if (value && !values.required_skills.includes(value)) onChange('required_skills', [...values.required_skills, value]) }} options={[{ value: '', label: 'Add a skill' }, ...options.skills.filter((skill) => !values.required_skills.includes(skill.value))]} />
            <div className="mt-2 flex flex-wrap gap-2">{values.required_skills.map((skill) => { const option = options.skills.find((item) => item.value === skill); return <button type="button" key={skill} onClick={() => onChange('required_skills', values.required_skills.filter((item) => item !== skill))} className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-[#C2410C]">{option?.label || skill} x</button> })}</div>
          </FormField>
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

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Requirements" helperText="Add one requirement per line.">
            <textarea value={values.requirements} onChange={(event) => onChange('requirements', event.target.value)} placeholder="e.g. 2 years of experience\nFood safety certificate" rows={4} className={`${fieldClass} resize-none`} />
          </FormField>
          <FormField label="Benefits" helperText="Add one benefit per line.">
            <textarea value={values.benefits} onChange={(event) => onChange('benefits', event.target.value)} placeholder="e.g. Staff meals\nTransport allowance" rows={4} className={`${fieldClass} resize-none`} />
          </FormField>
        </div>
      </FormSection>

      <ValidationErrors errors={error ? [error] : null} />
      <FormActions submitLabel={saving ? `${submitLabel === 'Post job' ? 'Posting' : 'Saving'}...` : submitLabel} loading={saving} />
    </form>
  )
}