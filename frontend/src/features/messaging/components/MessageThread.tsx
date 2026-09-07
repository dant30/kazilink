import { useEffect, useRef } from 'react'
import { MessageSquare } from 'lucide-react'
import type { Message } from '../types'
import { EmptyState } from '../../../shared/components/feedback'
import { Skeleton } from '../../../shared/components/ui/Skeleton'

export function MessageThread({ messages, currentUserId, loading }: { messages: Message[]; currentUserId?: number; loading?: boolean }) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages.length])
  if (loading) return <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5" aria-label="Loading messages" aria-busy="true"><Skeleton className="h-14 w-3/4 rounded-2xl" /><Skeleton className="ml-auto h-14 w-2/3 rounded-2xl" /><Skeleton className="h-14 w-1/2 rounded-2xl" /></div>
  if (!messages.length) return <EmptyState title="No messages yet" description="Send a message to discuss shift requirements, hourly rates, or arrival times." icon={<MessageSquare className="h-7 w-7" />} size="sm" className="flex-1 px-4 py-10 sm:px-6" />
  return <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-5">
    {messages.map((item) => { const own = item.sender === currentUserId; return <div key={item.id} className={`flex ${own ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-2xs sm:max-w-[75%] sm:px-4 sm:py-3 ${own ? 'rounded-br-xs bg-[#0A2540] text-white' : 'rounded-bl-xs border border-slate-200/80 bg-white text-slate-800'}`}><p className="whitespace-pre-wrap text-xs leading-relaxed sm:text-sm">{item.text}</p><div className={`mt-1.5 flex items-center gap-1.5 text-[10px] ${own ? 'justify-end text-slate-300' : 'text-slate-400'}`}>{!own && <span className="font-semibold text-slate-600">{item.sender_name}</span>}<span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div></div></div> })}
    <div ref={endRef} />
  </div>
}
