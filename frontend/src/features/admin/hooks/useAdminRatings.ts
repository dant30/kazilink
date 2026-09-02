import { useEffect, useState } from 'react'
import { deleteAdminRating, listAdminRatings, updateAdminRating } from '../services/ratings'
import type { Review, ReviewUpdateInput } from '../../ratings/types'

export function useAdminRatings() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionId, setActionId] = useState<number | null>(null)
  const load = () => {
    setLoading(true); setError('')
    return listAdminRatings().then(setReviews).catch((reason: Error) => setError(reason.message)).finally(() => setLoading(false))
  }
  useEffect(() => { void load() }, [])
  const update = async (id: number, data: ReviewUpdateInput) => { setActionId(id); setError(''); try { const review = await updateAdminRating(id, data); setReviews((items) => items.map((item) => item.id === id ? review : item)); return review } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to update review.'); throw reason } finally { setActionId(null) } }
  const remove = async (id: number) => { setActionId(id); setError(''); try { await deleteAdminRating(id); setReviews((items) => items.filter((item) => item.id !== id)) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to delete review.'); throw reason } finally { setActionId(null) } }
  return { reviews, loading, error, actionId, refresh: load, update, remove }
}
