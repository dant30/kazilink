import { useEffect, useState } from 'react'

import { getEstablishment, listEstablishments } from '../services'
import type { Establishment, EstablishmentFilters, EstablishmentListResponse } from '../types'

function results(value: EstablishmentListResponse) {
  return Array.isArray(value) ? value : value.results ?? []
}

export function useEstablishments(filters: EstablishmentFilters = {}) {
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    listEstablishments(filters)
      .then((data) => {
        if (!active) return
        setEstablishments(results(data as EstablishmentListResponse))
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
  }, [filters.q, filters.type])

  return { establishments, loading, error }
}

export function useEstablishment(id: number) {
  const [establishment, setEstablishment] = useState<Establishment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    getEstablishment(id)
      .then((data) => {
        if (!active) return
        setEstablishment(data)
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

  return { establishment, loading, error }
}

