import { useEffect, useState } from 'react'
import { listAdminSupportTickets, updateAdminSupportTicket } from '../services/support'
import type { SupportTicket } from '../../support/types'

export function useAdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionId, setActionId] = useState<number | null>(null)
  useEffect(() => {
    let active = true
    listAdminSupportTickets().then((items) => { if (active) setTickets(items) }).catch((reason: Error) => { if (active) setError(reason.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  const updateStatus = async (id: number, status: string, assigned_to_id?: number | null) => {
    setActionId(id); setError('')
    try { const updated = await updateAdminSupportTicket(id, status, assigned_to_id); setTickets((items) => items.map((ticket) => ticket.id === id ? updated : ticket)); return updated }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to update support ticket.'); throw reason }
    finally { setActionId(null) }
  }
  return { tickets, loading, error, actionId, updateStatus }
}