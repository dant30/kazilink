import { FormEvent, useState } from 'react'
import { Send, Star } from 'lucide-react'
import { FormActions, FormField, FormSection } from '../../../shared/components/forms'
import type { JobApplication } from '../../job_applications/types'
import type { ReviewInput } from '../types'
import { Select } from '../../../shared/components/ui/Select'

export function ReviewForm({ hires, onSubmit, submitting }: { hires: JobApplication[]; onSubmit: (data: ReviewInput) => Promise<unknown>; submitting?: boolean }) {
  const [selected, setSelected] = useState<JobApplication | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [role, setRole] = useState('')
  const submit = async (event: FormEvent) => { event.preventDefault(); if (!selected) return; await onSubmit({ target_worker: selected.worker, job: selected.job, rating, comment, role_performed: role }); setSelected(null); setComment(''); setRole('') }
  if (!hires.length) return <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Reviews become available after a completed hire.</div>
  return <form id="review-form" onSubmit={submit}><FormSection title="Leave a review" description="Review a worker from a completed hire." icon={<Star className="h-4 w-4" />} divider={false}><Select label="Completed hire" required value={String(selected?.id ?? '')} onChange={(value) => setSelected(hires.find((hire) => hire.id === Number(value)) ?? null)} options={[{ value: '', label: 'Select a hire' }, ...hires.map((hire) => ({ value: String(hire.id), label: hire.worker_name || `Worker #${hire.worker}`, sublabel: hire.job_title || `Job #${hire.job}` }))]} /><FormField label="Role performed" required><input required value={role} onChange={(event) => setRole(event.target.value)} placeholder="Waiter, supervisor..." className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF6B00]" /></FormField><FormField label="Rating" required><div className="flex gap-1">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`${value} stars`} onClick={() => setRating(value)}><Star className={`h-6 w-6 ${value <= rating ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-slate-300'}`} /></button>)}</div></FormField><FormField label="Comment" required><textarea required maxLength={5000} rows={4} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Share useful, professional feedback..." className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF6B00]" /></FormField></FormSection><FormActions formId="review-form" submitLabel="Submit review" loading={submitting} /></form>
}
