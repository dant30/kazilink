import { useEffect, useState } from 'react'
import { listAdminJobs } from '../services/jobs'
import type { Job } from '../../jobs/types'

export function useAdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    listAdminJobs()
      .then((items) => { if (active) setJobs(items) })
      .catch((reason: Error) => { if (active) setError(reason.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  return { jobs, loading, error }
}
