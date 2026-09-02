import { Bell, Briefcase, CheckCircle2, CreditCard, MessageSquare, ShieldAlert } from 'lucide-react'
import type { Notification } from '../types'

const icons = { application: Briefcase, application_status: CheckCircle2, message: MessageSquare, payment: CreditCard, fraud: ShieldAlert }

export function NotificationItem({ notification, onRead }: { notification: Notification; onRead: (id: number) => void }) {
  const Icon = icons[notification.notification_type as keyof typeof icons] || Bell
  return <button type="button" onClick={() => !notification.is_read && onRead(notification.id)} className={`flex w-full gap-3 p-4 text-left transition hover:bg-slate-50 ${!notification.is_read ? 'bg-orange-50/50' : 'bg-white'}`}>
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${notification.is_read ? 'bg-slate-100 text-slate-500' : 'bg-orange-100 text-[#FF6B00]'}`}><Icon className="h-4 w-4" /></span>
    <span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-3"><strong className={`text-sm ${notification.is_read ? 'font-semibold text-slate-700' : 'font-bold text-slate-900'}`}>{notification.title}</strong><time className="shrink-0 text-[10px] text-slate-400">{new Date(notification.timestamp).toLocaleDateString()}</time></span><span className="mt-1 block text-sm leading-5 text-slate-600">{notification.message}</span></span>
    {!notification.is_read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FF6B00]" aria-label="Unread" />}
  </button>
}
