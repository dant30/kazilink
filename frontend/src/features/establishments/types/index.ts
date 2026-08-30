export type Establishment = {
  id: number
  name: string
  establishment_type: string
  location: string
  address: string
  logo?: string | null
  is_verified: boolean
  verified_employers_count?: number
}

export type EstablishmentFilters = {
  q?: string
  type?: string
}

export type EstablishmentInput = {
  name: string
  establishment_type: string
  location: string
  address: string
  logo?: string | null
}

export type EstablishmentListResponse = Establishment[] | { count: number; next: string | null; previous: string | null; results: Establishment[] }
