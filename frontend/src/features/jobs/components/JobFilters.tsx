import type { JobFilters as JobFilterValues } from '../services'

const categoryOptions = [
  'Waiter',
  'Bartender',
  'Barmaid',
  'Cleaner',
  'Chef',
  'Barista',
  'Security',
  'Host',
]

export function JobFilters({ filters, onChange }: { filters: JobFilterValues; onChange: (filters: JobFilterValues) => void }) {
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

        <label className="space-y-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
          <span>Location</span>
          <select
            value={filters.location ?? ''}
            onChange={(event) => onChange({ ...filters, location: event.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-[#FF6B00] focus:outline-none"
          >
            <option value="">All locations</option>
            <option value="Nairobi">Nairobi</option>
            <option value="Mombasa">Mombasa</option>
            <option value="Kisumu">Kisumu</option>
            <option value="Nakuru">Nakuru</option>
          </select>
        </label>

        <label className="space-y-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
          <span>Category</span>
          <select
            value={filters.category ?? ''}
            onChange={(event) => onChange({ ...filters, category: event.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-[#FF6B00] focus:outline-none"
          >
            <option value="">All categories</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
          <span>Job type</span>
          <select
            value={filters.job_type ?? ''}
            onChange={(event) => onChange({ ...filters, job_type: event.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-[#FF6B00] focus:outline-none"
          >
            <option value="">All types</option>
            <option value="full_time">Full time</option>
            <option value="part_time">Part time</option>
            <option value="weekend_gig">Weekend gig</option>
            <option value="daily_shift">Daily shift</option>
            <option value="shift_24hr">24-hour shift</option>
          </select>
        </label>
      </div>
    </form>
  )
}