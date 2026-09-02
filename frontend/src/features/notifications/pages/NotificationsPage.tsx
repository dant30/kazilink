import { useState } from 'react'
import { Bell, CheckCheck, RefreshCw } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { Badge } from '../../../shared/components/ui/Badge'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Pagination } from '../../../shared/components/ui/Pagination'
import { NotificationItem, NotificationPreferences } from '../components'
import { useNotifications } from '../hooks/useNotifications'

export function NotificationsPage() {
  const { notifications, preferences, loading, error, refresh, markRead, markAllRead, updatePreferences } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [page, setPage] = useState(1)
  const unread = notifications.filter((notification) => !notification.is_read).length
  const visible = filter === 'unread' ? notifications.filter((notification) => !notification.is_read) : notifications
  const pageSize = 10
  const pagedNotifications = visible.slice((page - 1) * pageSize, page * pageSize)
  if (loading && !notifications.length) return <section className="mx-auto max-w-4xl px-4 py-8 text-sm text-slate-500">Loading notifications...</section>
  return <section className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <PageHeader eyebrow="Activity center" title="Notifications" description="Keep track of applications, messages, payments, and account activity." actions={<div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => refresh()} disabled={loading} aria-label="Refresh notifications" leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button><Button variant="outline" size="sm" onClick={() => markAllRead()} disabled={!unread} leftIcon={<CheckCheck className="h-4 w-4" />}>Mark all read</Button></div>} />
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
    <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]"><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 p-4"><div className="flex items-center gap-2"><Bell className="h-5 w-5 text-[#FF6B00]" /><h2 className="font-black text-[#0A2540]">Inbox</h2>{unread > 0 && <Badge variant="orange" size="sm">{unread} unread</Badge>}</div><div className="flex rounded-lg bg-slate-100 p-1"><button type="button" onClick={() => { setFilter('all'); setPage(1) }} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>All</button><button type="button" onClick={() => { setFilter('unread'); setPage(1) }} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${filter === 'unread' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Unread</button></div></div>{visible.length ? <><div className="divide-y divide-slate-100">{pagedNotifications.map((notification) => <NotificationItem key={notification.id} notification={notification} onRead={(id) => markRead(id).catch(() => undefined)} />)}</div><Pagination page={page} pageSize={pageSize} total={visible.length} onPageChange={setPage} className="m-4" /></> : <div className="p-10 text-center text-sm text-slate-500">{filter === 'unread' ? 'You are all caught up.' : 'No notifications yet.'}</div>}</section>{preferences && <NotificationPreferences preferences={preferences} onChange={(field, value) => updatePreferences({ [field]: value }).catch(() => undefined)} />}</div>
  </section>
}