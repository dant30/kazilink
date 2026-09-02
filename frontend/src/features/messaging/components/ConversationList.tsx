import { MessageCircle } from 'lucide-react'
import type { Conversation } from '../types'

export function ConversationList({ conversations, activeId, onSelect }: { conversations: Conversation[]; activeId: number | null; onSelect: (id: number) => void }) {
  if (!conversations.length) return <div className="flex min-h-40 flex-col items-center justify-center px-5 text-center text-slate-500"><MessageCircle className="mb-3 h-8 w-8 text-slate-300" /><p className="text-sm font-medium">No conversations yet</p><p className="mt-1 text-xs">Your job-related conversations will appear here.</p></div>
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
