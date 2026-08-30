import { useEffect, useState } from 'react'

import { loadHomeSummary } from '../services'
import { homeStore } from '../store'

export function useHomeSummary(enabled = true) {
  const [error, setError] = useState('')
  const snapshot = homeStore.getState()

  useEffect(() => {
    if (!enabled) return
    let active = true
    homeStore.setLoading(true)
    loadHomeSummary()
      .then((summary) => { if (active) homeStore.setSummary(summary) })
      .catch((reason: Error) => { if (active) { setError(reason.message); homeStore.setLoading(false) } })
    return () => { active = false }
  }, [enabled])

  return { ...snapshot, error }
}
