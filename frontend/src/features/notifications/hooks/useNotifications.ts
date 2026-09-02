import { useEffect } from 'react'
import { notificationStore, useNotificationStore } from '../store'
import { installNotificationSoundUnlock } from '../../../core/utils/notificationSound'

export function useNotifications({ enabled = true }: { enabled?: boolean } = {}) {
  const state = useNotificationStore()
  useEffect(() => {
    if (enabled && !state.initialized && !state.loading) void notificationStore.fetch().catch(() => undefined)
  }, [enabled, state.initialized, state.loading])
  useEffect(() => {
    if (!enabled) return

    const removeAudioUnlock = installNotificationSoundUnlock()
    notificationStore.startPolling()
    return () => {
      notificationStore.stopPolling()
      removeAudioUnlock()
    }
  }, [enabled])
  return { ...state, refresh: notificationStore.fetch, markRead: notificationStore.markRead, markAllRead: notificationStore.markAllRead, updatePreferences: notificationStore.updatePreferences }
}