import { MessageCircle } from 'lucide-react'
import type { Conversation } from '../types'
import { EmptyState } from '../../../shared/components/feedback'

export function ConversationList({ conversations, activeId, onSelect }: { conversations: Conversation[]; activeId: number | null; onSelect: (id: number) => void }) {
  if (!conversations.length) return <EmptyState title="No conversations yet" description="Your job-related conversations will appear here." icon={<MessageCircle className="h-8 w-8" />} size="sm" className="min-h-40 px-5" />
  return <div className="divide-y divide-slate-100">
    {conversations.map((conversation) => {
      const name = conversation.worker_name || conversation.employer_name || 'Conversation'
      return <button key={conversation.id} type="button" onClick={() => onSelect(conversation.id)} className={`w-full p-4 text-left transition hover:bg-slate-50 ${activeId === conversation.id ? 'border-l-4 border-[#FF6B00] bg-orange-50/60 pl-3' : ''}`}>
        <div className="flex items-start justify-between gap-3"><p className="truncate text-sm font-bold text-slate-900">{name}</p><time className="shrink-0 text-[10px] text-slate-400">{conversation.last_timestamp ? new Date(conversation.last_timestamp).toLocaleDateString() : ''}</time></div>
        <p className="mt-1 truncate text-xs text-slate-500">{conversation.last_message || 'No messages yet'}</p>
      </button>
    })}
  </div>
}
