import { useEffect, useState } from 'react'

import { getApplication, listApplications } from '../services'
import type { ApplicationFilters, JobApplication, JobApplicationListResponse } from '../types'

function results(value: JobApplicationListResponse) {
  return Array.isArray(value) ? value : value.results
}

export function useApplications(scope: 'mine' | 'employer' | 'admin' = 'mine', filters: ApplicationFilters = {}) {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    listApplications(scope, filters)
      .then((data) => {
        if (!active) return
        setApplications(results(data as JobApplicationListResponse))
      })
      .catch((reason: Error) => {
        if (!active) return
        setError(reason.message)
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [scope, filters.status])

  return { applications, loading, error }
}

export function useApplication(id: number) {
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    getApplication(id)
      .then((data) => {
        if (!active) return
        setApplication(data)
      })
      .catch((reason: Error) => {
        if (!active) return
        setError(reason.message)
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  return { application, loading, error }
}

