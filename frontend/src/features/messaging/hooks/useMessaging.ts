import { useEffect } from 'react'
import { messagingStore, useMessaging as useStore } from '../store'

export function useMessaging() {
  const state = useStore()
  useEffect(() => { if (!state.initialized && !state.loading) messagingStore.fetchConversations().catch(() => undefined) }, [state.initialized, state.loading])
  return { ...state, refresh: messagingStore.fetchConversations, selectConversation: messagingStore.fetchMessages, sendMessage: messagingStore.send }
}