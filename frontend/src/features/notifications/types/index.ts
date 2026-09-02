export type Notification = { id: number; title: string; message: string; notification_type: string; timestamp: string; is_read: boolean; link_tab: string }
export type NotificationPreferences = { email_enabled: boolean; sms_enabled: boolean; push_enabled: boolean }
export type NotificationListResponse = Notification[] | { count: number; next: string | null; previous: string | null; results: Notification[] }
