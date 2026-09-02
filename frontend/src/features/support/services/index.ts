import { endpoints } from '../../../core/api'
import type { SupportTicket, SupportTicketInput, SupportTicketListResponse } from '../types'

const results = (value: SupportTicketListResponse) => Array.isArray(value) ? value : value.results

export const supportServices = {
	async listTickets(): Promise<SupportTicket[]> { return results(await endpoints.support.list()) },
	getTicket: (id: number): Promise<SupportTicket> => endpoints.support.detail(id),
	createTicket: (data: SupportTicketInput): Promise<SupportTicket> => endpoints.support.create(data),
	closeTicket: (id: number): Promise<SupportTicket> => endpoints.support.close(id),
}
