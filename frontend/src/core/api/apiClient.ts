import axios, { type AxiosRequestConfig } from 'axios'
import http from './axios'
import { getCorrelationId } from './correlation'

export type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] }

export class ApiClientError extends Error {
  status?: number
  data: unknown
  correlationId?: string
  constructor(message: string, status?: number, data?: unknown, correlationId?: string) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.data = data
    this.correlationId = correlationId
  }
}

function errorMessage(data: unknown): string {
  if (typeof data === 'string') return data
  if (!data || typeof data !== 'object') return 'The request could not be completed.'

  const payload = 'error' in data && data.error && typeof data.error === 'object' ? data.error : data
  if ('detail' in payload) {
    if (typeof payload.detail === 'string') return payload.detail
    if (Array.isArray(payload.detail)) return payload.detail.map(String).join(' ')
  }
  if ('non_field_errors' in payload && Array.isArray(payload.non_field_errors)) return payload.non_field_errors.map(String).join(' ')

  const fieldErrors = Object.entries(payload)
    .filter(([, value]) => Array.isArray(value))
    .flatMap(([field, messages]) => (messages as unknown[]).map((message) => `${field}: ${String(message)}`))
  if (fieldErrors.length) return fieldErrors.join(' ')
  return 'The request could not be completed.'
}

export async function apiClient<T>(path: string, config: AxiosRequestConfig = {}): Promise<T> {
  try {
    return (await http.request<T>({ url: path, ...config })).data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as { response?: { data?: unknown; status?: number } }
      throw new ApiClientError(errorMessage(axiosError.response?.data), axiosError.response?.status, axiosError.response?.data, getCorrelationId(error.response?.headers))
    }
    throw error
  }
}

export const get = <T>(path: string, config?: AxiosRequestConfig) => apiClient<T>(path, { ...config, method: 'GET' })
export const post = <T>(path: string, data?: unknown, config?: AxiosRequestConfig) => apiClient<T>(path, { ...config, method: 'POST', data })
export const patch = <T>(path: string, data?: unknown, config?: AxiosRequestConfig) => apiClient<T>(path, { ...config, method: 'PATCH', data })
export const del = <T>(path: string, config?: AxiosRequestConfig) => apiClient<T>(path, { ...config, method: 'DELETE' })