import { useEffect, useState } from 'react'
import { exportAdminAnalytics, generateAdminAnalytics, listAdminAnalytics } from '../services/analytics'
import type { KPISnapshot } from '../../analytics/types'

export function useAdminAnalytics() {
  const [snapshots, setSnapshots] = useState<KPISnapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const load = () => {
    setLoading(true)
    setError('')
    return listAdminAnalytics().then(setSnapshots).catch((reason: Error) => setError(reason.message)).finally(() => setLoading(false))
  }
  useEffect(() => { void load() }, [])
  const generate = async (period_start: string, period_end: string) => {
    setProcessing(true)
    setError('')
    try {
      const snapshot = await generateAdminAnalytics(period_start, period_end)
      setSnapshots((items) => [snapshot, ...items.filter((item) => item.id !== snapshot.id)])
      return snapshot
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to generate analytics snapshot.')
      throw reason
    } finally { setProcessing(false) }
  }
  const download = async (id: number, periodStart: string, periodEnd: string) => {
    const blob = await exportAdminAnalytics(id)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `kpi-snapshot-${periodStart}-${periodEnd}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }
  return { snapshots, latest: snapshots[0] ?? null, loading, processing, error, refresh: load, generate, download }
}
