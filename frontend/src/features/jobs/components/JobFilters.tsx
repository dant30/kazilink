import { useEffect, useState } from 'react'
import { endpoints } from '../../../core/api'
import type { JobFilters as JobFilterValues } from '../services'
import { Select } from '../../../shared/components/ui/Select'

export function JobFilters({ filters, onChange }: { filters: JobFilterValues; onChange: (filters: JobFilterValues) => void }) {
  const [categoryOptions, setCategoryOptions] = useState<Array<{ value: string; label: string }>>([])
  const [locationOptions, setLocationOptions] = useState<Array<{ value: string; label: string }>>([])

  useEffect(() => {
    let active = true
    endpoints.auth.workerOccupations()
      .then((response) => { if (active) { setCategoryOptions(response.occupations); setLocationOptions(response.locations) } })
      .catch(() => { if (active) { setCategoryOptions([]); setLocationOptions([]) } })
    return () => { active = false }
  }, [])

  return (
    <form className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-3 md:grid-cols-4">
        <label className="space-y-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
          <span>Search</span>
          <input
            value={filters.q ?? ''}
            onChange={(event) => onChange({ ...filters, q: event.target.value })}
            placeholder="Role, skill, or keyword"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#FF6B00] focus:outline-none"
          />
        </label>

        <Select searchable label="Location" value={filters.location ?? ''} onChange={(value) => onChange({ ...filters, location: value })} options={[{ value: '', label: 'All locations' }, ...locationOptions]} />

        <Select searchable label="Category" value={filters.category ?? ''} onChange={(value) => onChange({ ...filters, category: value })} options={[{ value: '', label: 'All categories' }, ...categoryOptions]} />

        <Select label="Job type" value={filters.job_type ?? ''} onChange={(value) => onChange({ ...filters, job_type: value })} options={[{ value: '', label: 'All types' }, { value: 'full_time', label: 'Full time' }, { value: 'part_time', label: 'Part time' }, { value: 'weekend_gig', label: 'Weekend gig' }, { value: 'daily_shift', label: 'Daily shift' }, { value: 'shift_24hr', label: '24-hour shift' }]} />
      </div>
    </form>
  )
}