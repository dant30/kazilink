import { useEffect } from 'react'
import { messagingStore, useMessaging as useStore } from '../store'
import { installNotificationSoundUnlock } from '../../../core/utils/notificationSound'

export function useMessaging() {
  const state = useStore()
  useEffect(() => { if (!state.initialized && !state.loading) messagingStore.fetchConversations().catch(() => undefined) }, [state.initialized, state.loading])
  useEffect(() => {
    const removeAudioUnlock = installNotificationSoundUnlock()
    messagingStore.startPolling()
    return () => {
      messagingStore.stopPolling()
      removeAudioUnlock()
    }
  }, [])
  return { ...state, refresh: messagingStore.fetchConversations, selectConversation: messagingStore.fetchMessages, sendMessage: messagingStore.send }
}