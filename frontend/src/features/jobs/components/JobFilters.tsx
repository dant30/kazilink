import { useEffect, useState } from 'react'
import { endpoints } from '../../../core/api'
import type { JobFilters as JobFilterValues } from '../services'
import { Filter, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react'
import { Select } from '../../../shared/components/ui/Select'

export function JobFilters({ filters, onChange }: { filters: JobFilterValues; onChange: (filters: JobFilterValues) => void }) {
  const [categoryOptions, setCategoryOptions] = useState<Array<{ value: string; label: string }>>([])
  const [locationOptions, setLocationOptions] = useState<Array<{ value: string; label: string }>>([])
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    let active = true
    endpoints.auth.workerOccupations()
      .then((response) => { if (active) { setCategoryOptions(response.occupations); setLocationOptions(response.locations) } })
      .catch(() => { if (active) { setCategoryOptions([]); setLocationOptions([]) } })
    return () => { active = false }
  }, [])

  const hasActiveFilters = Boolean(filters.q || filters.location || filters.category || filters.job_type)
  const handleReset = () => onChange({ q: '', location: '', category: '', job_type: '' })
  const quickCategories = [{ value: '', label: 'All' }, ...['waiter', 'cook', 'bartender', 'barista', 'cleaner'].map((value) => ({ value, label: categoryOptions.find((option) => option.value === value)?.label || value }))]

  return (
    <form className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:p-5" onSubmit={(event) => event.preventDefault()}>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={filters.q ?? ''}
            onChange={(event) => onChange({ ...filters, q: event.target.value })}
            placeholder="Search by title, venue, or keyword..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-[#FF6B00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100"
          />
          {filters.q && <button type="button" onClick={() => onChange({ ...filters, q: '' })} className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700" aria-label="Clear search"><X className="h-3.5 w-3.5" /></button>}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowAdvanced((previous) => !previous)} className={`inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition sm:flex-initial ${showAdvanced || filters.location || filters.job_type ? 'border-[#FF6B00] bg-orange-50/70 text-[#FF6B00]' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}><SlidersHorizontal className="h-3.5 w-3.5" /><span>Filters</span>{hasActiveFilters && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6B00] text-[9px] font-black text-white">!</span>}</button>
          {hasActiveFilters && <button type="button" onClick={handleReset} className="inline-flex min-h-[42px] items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800" title="Reset all filters"><RotateCcw className="h-3.5 w-3.5" /><span className="hidden sm:inline">Reset</span></button>}
        </div>
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none"><span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick roles:</span>{quickCategories.map((category) => { const selected = filters.category === category.value; return <button key={category.value || 'all'} type="button" onClick={() => onChange({ ...filters, category: category.value })} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${selected ? 'bg-[#0A2540] text-white' : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'}`}>{category.label}</button> })}</div>
      <div className={`grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-3 ${showAdvanced ? 'block' : 'hidden sm:grid'}`}>
        <Select searchable label="Location" value={filters.location ?? ''} onChange={(value) => onChange({ ...filters, location: value })} options={[{ value: '', label: 'All locations' }, ...locationOptions]} />
        <Select searchable label="Category" value={filters.category ?? ''} onChange={(value) => onChange({ ...filters, category: value })} options={[{ value: '', label: 'All categories' }, ...categoryOptions]} />
        <Select label="Shift / Job Type" value={filters.job_type ?? ''} onChange={(value) => onChange({ ...filters, job_type: value })} options={[{ value: '', label: 'All types' }, { value: 'full_time', label: 'Full time' }, { value: 'part_time', label: 'Part time' }, { value: 'weekend_gig', label: 'Weekend gig' }, { value: 'daily_shift', label: 'Daily shift' }, { value: 'shift_24hr', label: '24-hour shift' }]} />
      </div>
    </form>
  )
}