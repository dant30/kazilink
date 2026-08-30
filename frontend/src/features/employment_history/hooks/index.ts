import { useEffect, useState } from 'react'

import { getEmploymentRecord, getVerificationQueue, listEmploymentHistory, getWorkerEmploymentHistory } from '../services'
import type { EmploymentHistoryListResponse, EmploymentRecord } from '../types'

function results(value: EmploymentHistoryListResponse) {
  return Array.isArray(value) ? value : value.results ?? []
}

export function useEmploymentHistory() {
  const [records, setRecords] = useState<EmploymentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    listEmploymentHistory()
      .then((data) => {
        if (!active) return
        setRecords(results(data as EmploymentHistoryListResponse))
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
  }, [])

  return { records, loading, error }
}

export function useEmploymentRecord(id: number) {
  const [record, setRecord] = useState<EmploymentRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    getEmploymentRecord(id)
      .then((data) => {
        if (!active) return
        setRecord(data)
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

  return { record, loading, error }
}

export function useWorkerEmploymentHistory(workerId: number) {
  const [records, setRecords] = useState<EmploymentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    getWorkerEmploymentHistory(workerId)
      .then((data) => {
        if (!active) return
        setRecords(results(data as EmploymentHistoryListResponse))
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
  }, [workerId])

  return { records, loading, error }
}

export function useVerificationQueue() {
  const [records, setRecords] = useState<EmploymentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    getVerificationQueue()
      .then((data) => {
        if (!active) return
        setRecords(results(data as EmploymentHistoryListResponse))
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
  }, [])

  return { records, loading, error }
}

