import axios from 'axios'
import { localStorageStore } from '../storage'

export const ACCESS_TOKEN_KEY = 'kazilink.access_token'
export const REFRESH_TOKEN_KEY = 'kazilink.refresh_token'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: { Accept: 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = localStorageStore.getString(ACCESS_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshRequest: Promise<string | null> | null = null

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean }
    if (error.response?.status !== 401 || original?._retry || !localStorageStore.getString(REFRESH_TOKEN_KEY)) return Promise.reject(error)
    original._retry = true
    refreshRequest ??= axios
      .post<{ access: string }>(`${http.defaults.baseURL}/accounts/token/refresh/`, { refresh: localStorageStore.getString(REFRESH_TOKEN_KEY) })
      .then(({ data }) => {
        localStorageStore.setString(ACCESS_TOKEN_KEY, data.access)
        return data.access
      })
      .catch(() => {
        localStorageStore.remove(ACCESS_TOKEN_KEY)
        localStorageStore.remove(REFRESH_TOKEN_KEY)
        return null
      })
      .finally(() => { refreshRequest = null })
    const token = await refreshRequest
    if (!token) return Promise.reject(error)
    original.headers.Authorization = `Bearer ${token}`
    return http(original)
  },
)

export default http