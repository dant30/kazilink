import { endpoints } from '../../../core/api'
import type { Notification, NotificationListResponse, NotificationPreferences } from '../types'

const results = <T>(value: T[] | { results: T[] }) => Array.isArray(value) ? value : value.results

export const notificationServices = {
	async list(unread = false): Promise<Notification[]> { return results(await endpoints.notifications.list(unread) as NotificationListResponse) },
	markRead: (id: number): Promise<Notification> => endpoints.notifications.markRead(id),
	markAllRead: () => endpoints.notifications.markAllRead(),
	getPreferences: async (): Promise<NotificationPreferences> => endpoints.notifications.preferences() as Promise<NotificationPreferences>,
	updatePreferences: async (data: Partial<NotificationPreferences>): Promise<NotificationPreferences> => endpoints.notifications.updatePreferences(data) as Promise<NotificationPreferences>,
}
