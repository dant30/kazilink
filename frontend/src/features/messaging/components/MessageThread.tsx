import { useEffect, useRef } from 'react'
import type { Message } from '../types'
import { EmptyState } from '../../../shared/components/feedback'
import { Skeleton } from '../../../shared/components/ui/Skeleton'

export function MessageThread({ messages, currentUserId, loading }: { messages: Message[]; currentUserId?: number; loading?: boolean }) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages.length])
  if (loading) return <div className="flex flex-1 flex-col gap-3 p-5" aria-label="Loading messages" aria-busy="true"><Skeleton className="h-16 w-3/4 rounded-2xl" /><Skeleton className="ml-auto h-16 w-3/4 rounded-2xl" /><Skeleton className="h-16 w-2/3 rounded-2xl" /></div>
  if (!messages.length) return <EmptyState title="No messages yet" description="Start the conversation below." size="sm" className="flex-1 px-6" />
  return <div className="flex-1 space-y-3 overflow-y-auto p-5">
    {messages.map((item) => { const own = item.sender === currentUserId; return <div key={item.id} className={`flex ${own ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-2xl px-4 py-3 ${own ? 'rounded-br-md bg-[#0A2540] text-white' : 'rounded-bl-md bg-slate-100 text-slate-800'}`}><p className="whitespace-pre-wrap text-sm leading-6">{item.text}</p><p className={`mt-1 text-[10px] ${own ? 'text-slate-300' : 'text-slate-400'}`}>{item.sender_name} · {new Date(item.timestamp).toLocaleString()}</p></div></div> })}
    <div ref={endRef} />
  </div>
}
