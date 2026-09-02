import { useEffect, useState } from 'react'

import { getJob, listJobs, type JobFilters, type JobListResponse } from '../services/jobs'
import { jobsStore } from '../store'
import type { Job } from '../types'

function results(value: JobListResponse) {
  return Array.isArray(value) ? value : value.results
}

export function useJobs(filters: JobFilters = {}) {
  const [jobs, setJobs] = useState<Job[]>(jobsStore.getState().jobs)
  const [loading, setLoading] = useState(jobsStore.getState().loading)
  const [error, setError] = useState(jobsStore.getState().error)

  useEffect(() => {
    const unsubscribe = jobsStore.subscribe(() => {
      const state = jobsStore.getState()
      setJobs(state.jobs)
      setLoading(state.loading)
      setError(state.error)
    })

    return () => { unsubscribe() }
  }, [])

  useEffect(() => {
    let active = true
    jobsStore.setFilters(filters)
    jobsStore.setLoading(true)
    jobsStore.setError('')

    listJobs(filters)
      .then((data) => {
        if (!active) return
        const nextJobs = results(data as JobListResponse)
        setJobs(nextJobs)
        jobsStore.setJobs(nextJobs)
      })
      .catch((reason: Error) => {
        if (!active) return
        setError(reason.message)
        jobsStore.setError(reason.message)
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
        jobsStore.setLoading(false)
      })

    return () => {
      active = false
    }
  }, [filters.q, filters.location, filters.category, filters.job_type, filters.min_pay, filters.max_pay, filters.featured, filters.urgent])

  return { jobs, loading, error }
}

export function useJob(id: number) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    getJob(id)
      .then((data) => {
        if (!active) return
        setJob(data)
        jobsStore.setSelectedJob(data)
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

  return { job, loading, error }
}