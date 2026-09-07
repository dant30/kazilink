import { useState } from 'react'
import { Bell, Briefcase, Calendar, CheckCheck, CreditCard, ExternalLink, MessageSquare, Settings2, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../../shared/components/ui/Button'
import { Badge } from '../../../shared/components/ui/Badge'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { NotificationItem, NotificationPreferences } from '../components'
import { useNotifications } from '../hooks/useNotifications'
import { EmptyState } from '../../../shared/components/feedback'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { Modal } from '../../../shared/components/ui/Modal'
import type { Notification } from '../types'
import { formatRelativeTime } from '../../../core/utils'

export function NotificationsPage() {
  const { notifications, preferences, loading, error, markRead, markAllRead, updatePreferences } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [page, setPage] = useState(1)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const unread = notifications.filter((notification) => !notification.is_read).length
  const visible = filter === 'unread' ? notifications.filter((notification) => !notification.is_read) : notifications
  const pageSize = 10
  const pagedNotifications = visible.slice((page - 1) * pageSize, page * pageSize)
  const getActionDetails = (notification: Notification) => {
    switch (notification.notification_type) {
      case 'application':
      case 'application_status': return { label: 'View applications', path: '/applications', icon: Briefcase }
      case 'message': return { label: 'Open messages', path: '/messages', icon: MessageSquare }
      case 'payment': return { label: 'View wallet & transactions', path: '/payments', icon: CreditCard }
      case 'fraud': return { label: 'Contact support', path: '/support', icon: ShieldAlert }
      default: return { label: 'Browse casual shifts', path: '/jobs', icon: ExternalLink }
    }
  }
  if (loading && !notifications.length) return <section className="mx-auto max-w-4xl space-y-3 px-4 py-8" aria-label="Loading notifications" aria-busy="true">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-16 rounded-2xl" />)}</section>
  return <section className="mx-auto max-w-5xl space-y-6 px-3.5 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
    <PageHeader eyebrow="Activity center" title="Notifications" description="Keep track of shift applications, employer messages, escrow payments, and account alerts." actions={<div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => setPreferencesOpen(true)} disabled={!preferences} aria-label="Open notification preferences" leftIcon={<Settings2 className="h-3.5 w-3.5" />}>Preferences</Button><Button variant="outline" size="sm" onClick={() => markAllRead()} disabled={!unread} leftIcon={<CheckCheck className="h-3.5 w-3.5" />}>Mark all read</Button></div>} />
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
    <div><section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs"><div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#FF6B00]"><Bell className="h-4 w-4" /></div><div><div className="flex items-center gap-2"><h2 className="text-base font-black text-[#0A2540]">Notification inbox</h2>{unread > 0 && <Badge variant="orange" size="sm">{unread} new</Badge>}</div><p className="text-[11px] text-slate-400">Click any notification to open its details.</p></div></div><div className="flex w-fit rounded-xl bg-slate-100 p-1"><button type="button" onClick={() => { setFilter('all'); setPage(1) }} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}>All ({notifications.length})</button><button type="button" onClick={() => { setFilter('unread'); setPage(1) }} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${filter === 'unread' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}>Unread ({unread})</button></div></div>{visible.length ? <><div className="divide-y divide-slate-100">{pagedNotifications.map((notification) => <NotificationItem key={notification.id} notification={notification} onRead={(id) => markRead(id).catch(() => undefined)} onSelect={setSelectedNotification} />)}</div><Pagination page={page} pageSize={pageSize} total={visible.length} onPageChange={setPage} className="m-4" /></> : <EmptyState title={filter === 'unread' ? 'You are all caught up' : 'No notifications yet'} description={filter === 'unread' ? 'There are no unread notifications right now.' : 'Updates about your applications, messages, and shift alerts will appear here.'} icon={<Bell className="h-8 w-8 text-slate-400" />} size="sm" />}</section>
    {selectedNotification && <Modal isOpen onClose={() => setSelectedNotification(null)} title={selectedNotification.title} subtitle={formatRelativeTime(selectedNotification.timestamp)} maxWidth="md"><div className="space-y-4 pt-1"><div className="flex items-center gap-2"><span className="rounded-full bg-orange-100/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#FF6B00]">{selectedNotification.notification_type?.replace(/_/g, ' ') || 'Notice'}</span><span className="flex items-center gap-1 text-xs text-slate-400"><Calendar className="h-3 w-3" />{new Date(selectedNotification.timestamp).toLocaleString()}</span></div><div className="whitespace-pre-line rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs leading-relaxed text-slate-700 sm:text-sm">{selectedNotification.message}</div><div className="flex flex-col items-stretch justify-end gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center"><Button variant="outline" size="sm" onClick={() => setSelectedNotification(null)}>Close</Button>{(() => { const action = getActionDetails(selectedNotification); const ActionIcon = action.icon; return <Link to={action.path} onClick={() => setSelectedNotification(null)} className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl bg-[#0A2540] px-4 py-2 text-xs font-bold text-white hover:bg-[#123860]"><ActionIcon className="h-3.5 w-3.5 text-[#FF6B00]" />{action.label}</Link> })()}</div></div></Modal>}
    {preferences && <Modal isOpen={preferencesOpen} onClose={() => setPreferencesOpen(false)} title="Notification preferences" subtitle="Choose how KaziLink sends you alerts and updates." maxWidth="lg"><NotificationPreferences preferences={preferences} onChange={(field, value) => updatePreferences({ [field]: value }).catch(() => undefined)} /></Modal>}</div>
  </section>
}