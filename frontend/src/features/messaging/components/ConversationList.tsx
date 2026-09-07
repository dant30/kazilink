import { Briefcase, MessageCircle, User } from 'lucide-react'
import type { Conversation } from '../types'
import { EmptyState } from '../../../shared/components/feedback'

export function ConversationList({ conversations, activeId, onSelect }: { conversations: Conversation[]; activeId: number | null; onSelect: (id: number) => void }) {
  if (!conversations.length) return <EmptyState title="No conversations yet" description="Your job-related messages will appear here once an application is initiated." icon={<MessageCircle className="h-7 w-7" />} size="sm" className="min-h-48 px-5 py-8" />
  return <div className="divide-y divide-slate-100">
    {conversations.map((conversation) => {
      const name = conversation.worker_name || conversation.employer_name || 'Conversation'
      const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
      const isActive = activeId === conversation.id
      return <button key={conversation.id} type="button" onClick={() => onSelect(conversation.id)} className={`flex w-full items-start gap-3 p-3.5 text-left transition sm:p-4 ${isActive ? 'border-l-4 border-[#FF6B00] bg-orange-50/70 pl-3 sm:pl-3.5' : 'hover:bg-slate-50 active:bg-slate-100'}`}>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black ${isActive ? 'bg-[#FF6B00] text-white' : 'bg-slate-100 text-slate-700'}`}>{initials || <User className="h-4 w-4" />}</div>
        <div className="min-w-0 flex-1"><div className="flex items-baseline justify-between gap-2"><p className={`truncate text-sm ${isActive ? 'font-black text-[#0A2540]' : 'font-bold text-slate-800'}`}>{name}</p><time className="shrink-0 text-[10px] font-medium text-slate-400">{conversation.last_timestamp ? new Date(conversation.last_timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}</time></div><p className="mt-0.5 truncate text-xs text-slate-500">{conversation.last_message || 'Start chatting...'}</p>{conversation.job && <span className="mt-1.5 inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600"><Briefcase className="h-2.5 w-2.5 text-[#FF6B00]" />Opportunity #{conversation.job}</span>}</div>
      </button>
    })}
  </div>
}
