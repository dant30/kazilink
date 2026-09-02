import { useEffect, useState } from 'react'
import { adminApplicationServices } from '../services/applications'
import type { ApplicationStatusInput, JobApplication } from '../../job_applications/types'

export function useAdminApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    adminApplicationServices.list()
      .then((items) => { if (active) setApplications(items) })
      .catch((reason: Error) => { if (active) setError(reason.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  const updateStatus = async (id: number, data: ApplicationStatusInput) => {
    try {
      const updated = await adminApplicationServices.updateStatus(id, data)
      setApplications((items) => items.map((item) => item.id === id ? updated : item))
      return updated
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to update application status.')
      throw reason
    }
  }
  return { applications, loading, error, updateStatus }
}
