import { useEffect } from 'react'
import { useAuthStore } from '../../auth'
import { dashboardServices } from '../services'
import { dashboardStore, useDashboardStore } from '../store'

export function useDashboard() {
  const { user } = useAuthStore()
  const state = useDashboardStore()
  const role = user?.is_employer && !user.is_worker ? 'employer' : 'worker'
  useEffect(() => {
    if (state.role !== role || !state.data) {
      const loader = role === 'employer' ? dashboardServices.loadEmployer : dashboardServices.loadWorker
      dashboardStore.fetch(role, loader).catch(() => undefined)
    }
  }, [role, state.role, state.data])
  return { ...state, data: state.role === role ? state.data : null, refresh: () => dashboardStore.fetch(role, role === 'employer' ? dashboardServices.loadEmployer : dashboardServices.loadWorker) }
}