export type SupportTicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | (string & {})
export type SupportTicket = { id: number; user: number; user_name: string; subject: string; description: string; status: SupportTicketStatus; assigned_to: number | null; assigned_to_name: string | null; created_at: string; updated_at: string }
export type SupportTicketInput = { subject: string; description: string }
export type SupportTicketListResponse = SupportTicket[] | { count: number; next: string | null; previous: string | null; results: SupportTicket[] }
