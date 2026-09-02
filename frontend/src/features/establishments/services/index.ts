import { endpoints } from '../../../core/api'
import type { Establishment, EstablishmentFilters, EstablishmentInput, EstablishmentListResponse } from '../types'

export type { Establishment, EstablishmentFilters, EstablishmentInput, EstablishmentListResponse }

function normalizeFilters(filters: EstablishmentFilters = {}) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ) as EstablishmentFilters
}

function queryString(filters: EstablishmentFilters = {}) {
  const params = new URLSearchParams()
  Object.entries(normalizeFilters(filters)).forEach(([key, value]) => {
    params.set(key, String(value))
  })
  return params.toString()
}

export function listEstablishments(filters: EstablishmentFilters = {}) {
  return endpoints.establishments.list(queryString(filters))
}

export function getEstablishment(id: number) {
  return endpoints.establishments.detail(id)
}

export function createEstablishment(data: EstablishmentInput) {
  return endpoints.establishments.create(data)
}

export function updateEstablishment(id: number, data: Partial<EstablishmentInput>) {
  return endpoints.establishments.update(id, data)
}

export function verifyEstablishment(id: number, verified = true) {
  void verified
  return endpoints.establishments.verify(id)
}

export function getAdminEstablishments() {
  return endpoints.establishments.adminList()
}

