import { useEffect, useState } from 'react'
import { listAdminPayments } from '../services/payments'
import type { Transaction } from '../../payments/types'

export function useAdminPayments() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    listAdminPayments()
      .then((items) => { if (active) setTransactions(items) })
      .catch((reason: Error) => { if (active) setError(reason.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return { transactions, loading, error }
}
