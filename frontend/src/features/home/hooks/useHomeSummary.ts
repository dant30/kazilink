import { useEffect, useSyncExternalStore } from 'react'

import { loadHomeSummary } from '../services'
import { homeStore } from '../store'

export function useHomeSummary(enabled = true) {
  const snapshot = useSyncExternalStore(homeStore.subscribe, homeStore.getState, homeStore.getState)

  useEffect(() => {
    if (!enabled) return
    let active = true
    homeStore.setLoading(true)
    loadHomeSummary()
      .then((summary) => { if (active) homeStore.setSummary(summary) })
      .catch(() => { if (active) homeStore.setError() })
    return () => { active = false }
  }, [enabled])

  return { ...snapshot }
}
