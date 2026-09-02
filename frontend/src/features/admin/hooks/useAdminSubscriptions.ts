import { useEffect, useState } from 'react'
import { listAdminSubscriptions } from '../services/subscriptions'
import type { Subscription } from '../../subscriptions/types'

export function useAdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [initialized, setInitialized] = useState(false)
  const load = () => {
    setLoading(true); setError('')
    return listAdminSubscriptions().then(setSubscriptions).catch((reason: Error) => setError(reason.message)).finally(() => { setLoading(false); setInitialized(true) })
  }
  useEffect(() => { void load() }, [])
  return { subscriptions, loading, error, initialized, refresh: load }
}
