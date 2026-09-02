import { useEffect, useState } from 'react'
import { listAdminAuditLogs } from '../services/audit'
import type { AuditLog } from '../../audit/types'

export function useAdminAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [initialized, setInitialized] = useState(false)
  const load = () => {
    setLoading(true)
    setError('')
    return listAdminAuditLogs().then(setLogs).catch((reason: Error) => setError(reason.message)).finally(() => { setLoading(false); setInitialized(true) })
  }
  useEffect(() => { void load() }, [])
  return { logs, loading, error, initialized, refresh: load }
}
