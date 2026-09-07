import { Bell, Briefcase, CheckCircle2, CreditCard, MessageSquare, ShieldAlert } from 'lucide-react'
import type { Notification } from '../types'
import { formatRelativeTime } from '../../../core/utils'

const icons = { application: Briefcase, application_status: CheckCircle2, message: MessageSquare, payment: CreditCard, fraud: ShieldAlert }

export function NotificationItem({ notification, onRead, onSelect }: { notification: Notification; onRead: (id: number) => void; onSelect?: (notification: Notification) => void }) {
  const Icon = icons[notification.notification_type as keyof typeof icons] || Bell
  const handleClick = () => { if (!notification.is_read) onRead(notification.id); onSelect?.(notification) }
  return <button type="button" onClick={handleClick} className={`group flex min-h-[64px] w-full items-start gap-3.5 p-4 text-left transition-colors sm:p-5 ${!notification.is_read ? 'border-l-4 border-l-[#FF6B00] bg-orange-50/40 hover:bg-orange-50/70' : 'bg-white hover:bg-slate-50/90'}`}>
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition ${notification.is_read ? 'bg-slate-100 text-slate-500' : 'bg-orange-100/80 text-[#FF6B00] shadow-2xs'}`}><Icon className="h-4 w-4" /></span>
    <span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-2"><strong className={`text-xs leading-snug transition-colors group-hover:text-[#FF6B00] sm:text-sm ${notification.is_read ? 'font-semibold text-slate-700' : 'font-black text-slate-900'}`}>{notification.title}</strong><time className="shrink-0 text-[11px] font-medium text-slate-400">{formatRelativeTime(notification.timestamp)}</time></span><span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-slate-600">{notification.message}</span></span>
    {!notification.is_read && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#FF6B00] ring-4 ring-orange-100" aria-label="Unread" />}
  </button>
}
