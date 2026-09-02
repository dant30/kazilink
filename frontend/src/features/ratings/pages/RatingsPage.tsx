import { RefreshCw, Star } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { Modal } from '../../../shared/components/ui/Modal'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { useAuthStore } from '../../auth/store'
import { ReviewCard, ReviewForm } from '../components'
import { useRatings } from '../hooks/useRatings'
import { EmptyState } from '../../../shared/components/feedback'
import { useState } from 'react'

export function RatingsPage() {
  const { user } = useAuthStore()
  const [reviewOpen, setReviewOpen] = useState(false)
  const [page, setPage] = useState(1)
  const isEmployer = Boolean(user?.is_employer)
  const { reviews, eligibleHires, loading, submitting, error, refresh, createReview } = useRatings({ isEmployer })
  const pageSize = 6
  const visibleReviews = reviews.slice((page - 1) * pageSize, page * pageSize)
  const submitReview = async (data: Parameters<typeof createReview>[0]) => { await createReview(data); setReviewOpen(false) }
  return <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"><PageHeader eyebrow="Trust signals" title="Reviews & ratings" description="Read verified feedback from completed KaziLink hires." actions={<div className="flex items-center gap-3"><Star className="hidden h-10 w-10 fill-orange-300 text-orange-300 sm:block" />{isEmployer && <Button onClick={() => setReviewOpen(true)}>Leave a review</Button>}</div>} />{error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}<section className="space-y-4"><div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-black text-[#0A2540]">Recent reviews</h2><p className="text-sm text-slate-500">{reviews.length} review{reviews.length === 1 ? '' : 's'} available</p></div><Button variant="ghost" size="sm" onClick={() => refresh()} disabled={loading} leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button></div>{loading && !reviews.length ? <div className="space-y-3 rounded-xl bg-slate-50 p-8" aria-label="Loading reviews" aria-busy="true"><Skeleton className="h-24 w-full rounded-2xl" /><Skeleton className="h-24 w-full rounded-2xl" /><Skeleton className="h-24 w-full rounded-2xl" /></div> : reviews.length ? <>{visibleReviews.map((review) => <ReviewCard key={review.id} review={review} />)}<Pagination page={page} pageSize={pageSize} total={reviews.length} onPageChange={setPage} /></> : <EmptyState title="No reviews have been submitted yet" description="Completed hire feedback will appear here." icon={<Star className="h-8 w-8" />} size="sm" />}</section><Modal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} title="Leave a review" subtitle="Reviews are available for completed hires." maxWidth="lg"><ReviewForm hires={eligibleHires} onSubmit={submitReview} submitting={submitting} /></Modal></section>
}
