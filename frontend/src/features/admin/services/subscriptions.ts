import { endpoints } from '../../../core/api'
import type { Subscription } from '../../subscriptions/types'

export async function listAdminSubscriptions(): Promise<Subscription[]> {
  const response = await endpoints.subscriptions.adminList()
  return Array.isArray(response) ? response : response.results
}
