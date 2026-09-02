import { endpoints } from '../../../core/api'
import type { Review, ReviewListResponse, ReviewUpdateInput } from '../../ratings/types'

export async function listAdminRatings(): Promise<Review[]> {
  const response = await endpoints.ratings.adminList()
  return Array.isArray(response) ? response : response.results
}

export const updateAdminRating = (id: number, data: ReviewUpdateInput): Promise<Review> => endpoints.ratings.update(id, data)
export const deleteAdminRating = (id: number) => endpoints.ratings.remove(id)
