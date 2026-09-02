import { useEffect } from 'react'
import { notificationStore, useNotificationStore } from '../store'

export function useNotifications({ enabled = true }: { enabled?: boolean } = {}) {
  const state = useNotificationStore()
  useEffect(() => { if (enabled && !state.initialized && !state.loading) notificationStore.fetch().catch(() => undefined) }, [enabled, state.initialized, state.loading])
  return { ...state, refresh: notificationStore.fetch, markRead: notificationStore.markRead, markAllRead: notificationStore.markAllRead, updatePreferences: notificationStore.updatePreferences }
}