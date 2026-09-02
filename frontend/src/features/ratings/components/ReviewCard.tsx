import { Star } from 'lucide-react'
import { Badge } from '../../../shared/components/ui/Badge'
import type { Review } from '../types'

export function ReviewCard({ review }: { review: Review }) {
  const rating = Number(review.rating)
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-black text-slate-900">{review.target_worker_name}</p><p className="mt-1 text-xs text-slate-500">{review.role_performed}{review.establishment_name ? ` · ${review.establishment_name}` : ''}</p></div><div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < rating ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-slate-300'}`} />)}{review.is_verified_hire && <Badge variant="success" size="sm">Verified hire</Badge>}</div></div><p className="mt-4 text-sm leading-6 text-slate-600">{review.comment}</p><p className="mt-3 text-xs text-slate-400">Reviewed by {review.author_name} · {new Date(review.date).toLocaleDateString()}</p></article>
}
