import { MessageCircle, RefreshCw } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { useAuthStore } from '../../auth/store'
import { ConversationList, MessageComposer, MessageThread } from '../components'
import { useMessaging } from '../hooks/useMessaging'

export function MessagingPage() {
  const { user } = useAuthStore()
  const { conversations, activeConversationId, messages, loading, messagesLoading, sending, error, refresh, selectConversation, sendMessage } = useMessaging()
  const active = conversations.find((conversation) => conversation.id === activeConversationId)
  const participant = active ? (active.worker === user?.id ? active.employer_name : active.worker_name) : null

  return <section className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6B00]">KaziLink inbox</p><h1 className="mt-1 text-3xl font-black text-[#0A2540]">Messages</h1><p className="mt-1 text-sm text-slate-500">Stay connected with workers and employers about active opportunities.</p></div><Button variant="outline" onClick={() => refresh()} disabled={loading} aria-label="Refresh conversations" leftIcon={<RefreshCw className="h-4 w-4" />}>Refresh</Button></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}
    <div className="grid min-h-[620px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[minmax(240px,0.35fr)_1fr]">
      <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r"><div className="border-b border-slate-200 p-4"><h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700">Conversations</h2></div><ConversationList conversations={conversations} activeId={activeConversationId} onSelect={(id) => selectConversation(id).catch(() => undefined)} /></aside>
      <main className="flex min-h-[560px] flex-col"><div className="flex items-center gap-3 border-b border-slate-200 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-[#FF6B00]"><MessageCircle className="h-5 w-5" /></div><div><h2 className="font-bold text-slate-900">{participant || 'Select a conversation'}</h2>{active?.job && <p className="text-xs text-slate-500">Job conversation #{active.job}</p>}</div></div><MessageThread messages={messages} currentUserId={user?.id} loading={messagesLoading} /><MessageComposer onSend={sendMessage} sending={sending} disabled={!activeConversationId} /></main>
    </div>
  </section>
}
