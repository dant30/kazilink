import { Star, ShieldCheck, Building2, User } from 'lucide-react'
import type { Review } from '../types'
import { formatRelativeTime } from '../../../core/utils'

export function ReviewCard({ review }: { review: Review }) {
  const rating = Number(review.rating)

  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#FF6B00] font-black text-sm border border-orange-100">
            {(review.target_worker_name || review.target_employer_name) ? (review.target_worker_name || review.target_employer_name || '').charAt(0).toUpperCase() : <User className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors">
              {review.target_worker_name || review.target_employer_name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500 font-medium">
              <span>{review.role_performed}</span>
              {review.establishment_name && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <Building2 className="h-3 w-3 text-slate-400" />
                    {review.establishment_name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-orange-50/70 px-2.5 py-1" aria-label={`${rating} out of 5 stars`}>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className={`h-3.5 w-3.5 ${
                    index < rating ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-black text-[#FF6B00] ml-1">{rating.toFixed(1)}</span>
          </div>

          {review.is_verified_hire && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              Verified Hire
            </span>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-700">
        "{review.comment}"
      </p>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Reviewed by <strong className="text-slate-600 font-semibold">{review.author_name}</strong></span>
        <span>{formatRelativeTime(review.date)}</span>
      </div>
    </article>
  )
}

