import axios from 'axios'

export const ACCESS_TOKEN_KEY = 'kazilink.access_token'
export const REFRESH_TOKEN_KEY = 'kazilink.refresh_token'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: { Accept: 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshRequest: Promise<string | null> | null = null

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean }
    if (error.response?.status !== 401 || original?._retry || !localStorage.getItem(REFRESH_TOKEN_KEY)) return Promise.reject(error)
    original._retry = true
    refreshRequest ??= axios
      .post<{ access: string }>(`${http.defaults.baseURL}/accounts/token/refresh/`, { refresh: localStorage.getItem(REFRESH_TOKEN_KEY) })
      .then(({ data }) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
        return data.access
      })
      .catch(() => {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
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