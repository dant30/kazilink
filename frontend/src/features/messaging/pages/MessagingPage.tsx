import { useState } from 'react'
import { ArrowLeft, MessageCircle, RefreshCw, User } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { useAuthStore } from '../../auth/store'
import { ConversationList, MessageComposer, MessageThread } from '../components'
import { useMessaging } from '../hooks/useMessaging'

export function MessagingPage() {
  const { user } = useAuthStore()
  const { conversations, activeConversationId, messages, loading, messagesLoading, sending, error, refresh, selectConversation, sendMessage } = useMessaging()
  const active = conversations.find((conversation) => conversation.id === activeConversationId)
  const [mobileView, setMobileView] = useState<'list' | 'thread'>('list')
  const participant = active ? (active.worker === user?.id ? active.employer_name : active.worker_name) : null
  const handleSelectConversation = async (id: number) => { try { await selectConversation(id); setMobileView('thread') } catch { /* hook exposes the error state */ } }

  return <section className="mx-auto max-w-7xl space-y-5 px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
    <div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6B00]">Direct messages</p><h1 className="mt-1 text-3xl font-black text-[#0A2540]">Hospitality chat</h1><p className="mt-1 text-sm text-slate-500">Communicate with shift workers and venue managers in real time.</p></div><Button variant="outline" size="sm" onClick={() => refresh()} disabled={loading} aria-label="Refresh conversations" leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />}>Refresh</Button></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}
    <div className="grid min-h-[580px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs sm:min-h-[640px] lg:grid-cols-[minmax(280px,0.35fr)_1fr]">
      <aside className={`border-b border-slate-200 lg:block lg:border-b-0 lg:border-r ${mobileView === 'thread' && activeConversationId ? 'hidden' : 'block'}`}><div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-4 py-3.5"><h2 className="text-xs font-black uppercase tracking-[0.16em] text-slate-700">Conversations ({conversations.length})</h2><span className="text-[11px] font-medium text-slate-500">Active shifts</span></div><ConversationList conversations={conversations} activeId={activeConversationId} onSelect={handleSelectConversation} /></aside>
      <main className={`min-h-[500px] flex-col ${mobileView === 'list' && !activeConversationId ? 'hidden lg:flex' : 'flex'}`}><div className="flex items-center justify-between border-b border-slate-200 bg-white p-3 sm:p-4"><div className="flex min-w-0 items-center gap-3"><button type="button" onClick={() => setMobileView('list')} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden" aria-label="Back to conversations"><ArrowLeft className="h-4 w-4" /></button><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[#FF6B00]"><User className="h-4 w-4" /></div><div className="min-w-0"><h2 className="truncate text-sm font-black text-slate-900 sm:text-base">{participant || 'Select a conversation'}</h2>{active?.job && <p className="truncate text-[11px] text-slate-500">Hospitality opportunity #{active.job}</p>}</div></div>{active && <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />Active chat</span>}</div><div className="flex flex-1 flex-col justify-between overflow-hidden bg-slate-50/40"><MessageThread messages={messages} currentUserId={user?.id} loading={messagesLoading} /><MessageComposer onSend={sendMessage} sending={sending} disabled={!activeConversationId} /></div></main>
    </div>
  </section>
}
