import { useSyncExternalStore } from 'react'
import { messagingServices } from '../services'
import { authStore } from '../../auth/store'
import { playNotificationSound } from '../../../core/utils/notificationSound'
import type { Conversation, Message } from '../types'

type MessagingState = {
	conversations: Conversation[]
	activeConversationId: number | null
	messages: Message[]
	loading: boolean
	messagesLoading: boolean
	sending: boolean
	initialized: boolean
	error: string | null
}

const initialState: MessagingState = { conversations: [], activeConversationId: null, messages: [], loading: false, messagesLoading: false, sending: false, initialized: false, error: null }
let state = initialState
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())
const message = (error: unknown) => error instanceof Error ? error.message : 'Unable to load messages.'
let conversationsRequest: Promise<Conversation[]> | null = null
let pollingUsers = 0
let pollingTimer: ReturnType<typeof setInterval> | null = null
let visibilityHandler: (() => void) | null = null

const pollMessages = () => {
	if (typeof document === 'undefined' || document.visibilityState === 'visible') {
		void messagingStore.fetchConversations().catch(() => undefined)
	}
}

export const messagingStore = {
	getState: () => state,
	subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
	async fetchConversations() {
		if (conversationsRequest) return conversationsRequest
		state = { ...state, loading: true, error: null }; notify()
		conversationsRequest = messagingServices.listConversations()
			.then(async (conversations) => {
			const activeConversationId = state.activeConversationId ?? conversations[0]?.id ?? null
			state = { ...state, conversations, activeConversationId, loading: false, initialized: true }; notify()
			if (activeConversationId) await messagingStore.fetchMessages(activeConversationId)
			return conversations
			})
			.catch((error) => { state = { ...state, loading: false, initialized: true, error: message(error) }; notify(); throw error })
			.finally(() => { conversationsRequest = null })
		return conversationsRequest
	},
	startPolling() {
		pollingUsers += 1
		if (pollingUsers !== 1 || typeof window === 'undefined') return

		pollingTimer = setInterval(pollMessages, 15_000)
		visibilityHandler = () => {
			if (document.visibilityState === 'visible') pollMessages()
		}
		document.addEventListener('visibilitychange', visibilityHandler)
	},
	stopPolling() {
		pollingUsers = Math.max(0, pollingUsers - 1)
		if (pollingUsers > 0) return

		if (pollingTimer) {
			clearInterval(pollingTimer)
			pollingTimer = null
		}
		if (visibilityHandler && typeof document !== 'undefined') {
			document.removeEventListener('visibilitychange', visibilityHandler)
			visibilityHandler = null
		}
	},
	async fetchMessages(id: number) {
		state = { ...state, activeConversationId: id, messagesLoading: true, error: null }; notify()
		try {
			const messages = await messagingServices.listMessages(id)
			const currentUserId = authStore.getState().user?.id
			const hasIncomingMessage = state.messages.length > 0 && messages.some((item) => item.sender !== currentUserId && !state.messages.some((current) => current.id === item.id))
			state = { ...state, messages, messagesLoading: false }; notify()
			if (hasIncomingMessage) playNotificationSound('message')
			await messagingServices.markRead(id)
			return messages
		} catch (error) { state = { ...state, messagesLoading: false, error: message(error) }; notify(); throw error }
	},
	async send(text: string) {
		const conversationId = state.activeConversationId
		if (!conversationId || !text.trim()) return
		state = { ...state, sending: true, error: null }; notify()
		try {
			const sent = await messagingServices.sendMessage(conversationId, text.trim())
			state = { ...state, messages: [...state.messages, sent], sending: false, conversations: state.conversations.map((conversation) => conversation.id === sent.conversation ? { ...conversation, last_message: sent.text, last_timestamp: sent.timestamp } : conversation) }; notify()
			return sent
		} catch (error) { state = { ...state, sending: false, error: message(error) }; notify(); throw error }
	},
}

export function useMessaging() {
	return useSyncExternalStore(messagingStore.subscribe, messagingStore.getState, messagingStore.getState)
}
