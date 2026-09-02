import { Mail, MessageSquare, Smartphone } from 'lucide-react'
import { Switch } from '../../../shared/components/ui/Switch'
import type { NotificationPreferences as Preferences } from '../types'

export function NotificationPreferences({ preferences, onChange }: { preferences: Preferences; onChange: (field: keyof Preferences, value: boolean) => void }) {
  const items = [['email_enabled', 'Email notifications', 'Receive important updates by email.', Mail], ['sms_enabled', 'SMS notifications', 'Receive time-sensitive updates by SMS.', Smartphone], ['push_enabled', 'Push notifications', 'Receive updates in the app.', MessageSquare] ] as const
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-black text-[#0A2540]">Notification preferences</h2><p className="mt-1 text-sm text-slate-500">Choose how KaziLink keeps you informed.</p><div className="mt-4 divide-y divide-slate-100">{items.map(([field, title, description, Icon]) => <div key={field} className="flex items-center justify-between gap-4 py-3"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Icon className="h-4 w-4" /></span><div><p className="text-sm font-semibold text-slate-800">{title}</p><p className="text-xs text-slate-500">{description}</p></div></div><Switch checked={preferences[field]} onChange={(value) => onChange(field, value)} size="sm" /></div>)}</div></section>
}
