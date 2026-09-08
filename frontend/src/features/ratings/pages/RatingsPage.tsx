import { useMemo, useState } from 'react'
import {
  Award,
  PenSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { Modal } from '../../../shared/components/ui/Modal'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { StatCard } from '../../../shared/components/cards/StatCard'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { useAuthStore } from '../../auth/store'
import { ReviewCard, ReviewForm } from '../components'
import { useRatings } from '../hooks/useRatings'
import { EmptyState } from '../../../shared/components/feedback'

export function RatingsPage() {
  const { user } = useAuthStore()
  const [reviewOpen, setReviewOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [starFilter, setStarFilter] = useState<number | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const isEmployer = Boolean(user?.is_employer)
  const isWorker = Boolean(user?.is_worker)
  const { reviews, eligibleHires, loading, submitting, error, refresh, createReview } = useRatings({ isEmployer, isWorker })
  const relevantReviews = reviews

  const pageSize = 6

  const stats = useMemo(() => {
    if (!relevantReviews.length) {
      return { average: null, total: 0, fiveStar: 0, verified: 0 }
    }
    const sum = relevantReviews.reduce((acc, curr) => acc + Number(curr.rating), 0)
    const avg = sum / relevantReviews.length
    const fiveStar = relevantReviews.filter((r) => Number(r.rating) === 5).length
    const verified = relevantReviews.filter((r) => r.is_verified_hire).length
    return {
      average: Math.round(avg * 10) / 10,
      total: relevantReviews.length,
      fiveStar,
      verified,
    }
  }, [relevantReviews])

  const filteredReviews = useMemo(() => {
    return relevantReviews.filter((review) => {
      const matchesStars = starFilter === 'all' || Math.floor(Number(review.rating)) === starFilter
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        review.target_worker_name?.toLowerCase().includes(query) ||
        review.target_employer_name?.toLowerCase().includes(query) ||
        review.role_performed?.toLowerCase().includes(query) ||
        review.establishment_name?.toLowerCase().includes(query) ||
        review.comment?.toLowerCase().includes(query)

      return matchesStars && matchesSearch
    })
  }, [relevantReviews, starFilter, searchQuery])

  const visibleReviews = filteredReviews.slice((page - 1) * pageSize, page * pageSize)

  const submitReview = async (data: Parameters<typeof createReview>[0]) => {
    await createReview(data)
    setReviewOpen(false)
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6 sm:space-y-8 px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8">
      <PageHeader
        eyebrow="Trust & Safety"
        title="Reviews & Ratings"
        description="Transparent, authenticated performance ratings from completed hospitality shifts across Kenya."
        icon={<Star className="h-4 w-4" />}
        actions={
          isEmployer || isWorker ? (
            <Button
              onClick={() => setReviewOpen(true)}
              leftIcon={<PenSquare className="h-4 w-4" />}
              className="rounded-xl text-xs font-bold min-h-[40px]"
            >
              {isWorker ? 'Review an employer' : 'Leave a review'}
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title="Your average rating"
          value={stats.average === null ? '—' : `${stats.average} / 5.0`}
          subtitle="From completed hires"
          icon={<Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Reviews received"
          value={stats.total}
          subtitle="Feedback about your work"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="5-Star reviews"
          value={stats.fiveStar}
          subtitle="Top-rated completed hires"
          icon={<Award className="h-4 w-4 text-[#FF6B00]" />}
          iconBg="bg-orange-50"
        />
        <StatCard
          title="Verified hires"
          value={stats.verified}
          subtitle="Completed platform hires"
          icon={<ShieldCheck className="h-4 w-4 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col gap-3 pb-5 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0A2540]">Recent reviews</h2>
            <p className="text-xs text-slate-500">
              {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'} matching your search
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                placeholder="Filter worker, venue, or role..."
                className="w-full sm:w-56 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-[#FF6B00] focus:outline-none"
              />
            </div>

            <div className="flex overflow-x-auto rounded-xl bg-slate-100 p-1">
              {(['all', 5, 4, 3] as const).map((filterVal) => (
                <button
                  key={String(filterVal)}
                  type="button"
                  onClick={() => {
                    setStarFilter(filterVal)
                    setPage(1)
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition shrink-0 ${
                    starFilter === filterVal
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {filterVal === 'all' ? 'All' : `${filterVal} ★`}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => refresh()}
              disabled={loading}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              className="rounded-xl text-xs w-fit"
            >
              Refresh
            </Button>
          </div>
        </div>

        {loading && !reviews.length ? (
          <div className="space-y-4" aria-label="Loading reviews" aria-busy="true">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
        ) : filteredReviews.length ? (
          <>
            <div className="space-y-4">
              {visibleReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            <Pagination
              page={page}
              pageSize={pageSize}
              total={filteredReviews.length}
              onPageChange={setPage}
            />
          </>
        ) : (
          <EmptyState
            title="No reviews found"
            description={
              searchQuery || starFilter !== 'all'
                ? 'No reviews match your selected filter criteria.'
                : 'Completed hire feedback will appear here once submitted.'
            }
            icon={<Star className="h-8 w-8 text-slate-400" />}
            size="md"
          />
        )}
      </section>

      <Modal
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="Leave a verified review"
        subtitle="Reviews can be submitted for your completed shifts and hires."
        maxWidth="lg"
      >
        <ReviewForm hires={eligibleHires} onSubmit={submitReview} submitting={submitting} isWorker={isWorker} />
      </Modal>
    </section>
  )
}

