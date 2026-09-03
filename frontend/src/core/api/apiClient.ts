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

function errorMessage(data: unknown) {
  if (typeof data === 'object' && data !== null && 'detail' in data && typeof data.detail === 'string') return data.detail
  if (typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'object' && data.error !== null && 'detail' in data.error && typeof data.error.detail === 'string') return data.error.detail
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