import { useSyncExternalStore } from 'react'
import { notificationServices } from '../services'
import type { Notification, NotificationPreferences } from '../types'

type State = { notifications: Notification[]; preferences: NotificationPreferences | null; loading: boolean; initialized: boolean; error: string | null }
const initialState: State = { notifications: [], preferences: null, loading: false, initialized: false, error: null }
let state = initialState
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Unable to load notifications.'
let fetchRequest: Promise<Notification[]> | null = null

export const notificationStore = {
	getState: () => state,
	subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
	async fetch() {
		if (fetchRequest) return fetchRequest
		state = { ...state, loading: true, error: null }; notify()
		fetchRequest = Promise.all([notificationServices.list(), notificationServices.getPreferences()])
			.then(([notifications, preferences]) => {
				state = { ...state, notifications, preferences, loading: false, initialized: true }
				notify()
				return notifications
			})
			.catch((error) => {
				state = { ...state, loading: false, initialized: true, error: errorMessage(error) }
				notify()
				throw error
			})
			.finally(() => { fetchRequest = null })
		return fetchRequest
	},
	async markRead(id: number) { const item = await notificationServices.markRead(id); state = { ...state, notifications: state.notifications.map((notification) => notification.id === id ? item : notification) }; notify(); return item },
	async markAllRead() { await notificationServices.markAllRead(); state = { ...state, notifications: state.notifications.map((notification) => ({ ...notification, is_read: true })) }; notify() },
	async updatePreferences(data: Partial<NotificationPreferences>) { const preferences = await notificationServices.updatePreferences(data); state = { ...state, preferences }; notify(); return preferences },
}

export function useNotificationStore() { return useSyncExternalStore(notificationStore.subscribe, notificationStore.getState, notificationStore.getState) }
