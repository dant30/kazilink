import { endpoints } from '../../../core/api'
import type { SupportTicket, SupportTicketListResponse } from '../../support/types'

export async function listAdminSupportTickets(): Promise<SupportTicket[]> {
  const response = await endpoints.support.adminList()
  return Array.isArray(response) ? response : response.results
}

export function updateAdminSupportTicket(id: number, status: string, assigned_to_id?: number | null) {
  return endpoints.support.staffUpdate(id, { status, assigned_to_id })
}