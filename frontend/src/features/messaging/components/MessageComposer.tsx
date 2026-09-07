import { FormEvent, KeyboardEvent, useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'

export function MessageComposer({ onSend, sending, disabled }: { onSend: (text: string) => Promise<unknown>; sending?: boolean; disabled?: boolean }) {
  const [text, setText] = useState('')
  const submit = async (event?: FormEvent) => { event?.preventDefault(); if (!text.trim() || sending || disabled) return; const messageToSend = text; setText(''); try { await onSend(messageToSend) } catch { setText(messageToSend) } }
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void submit() } }
  return <form onSubmit={submit} className="flex items-end gap-2 border-t border-slate-200 bg-white p-2.5 sm:gap-3 sm:p-4"><textarea value={text} onChange={(event) => setText(event.target.value)} onKeyDown={handleKeyDown} disabled={disabled || sending} maxLength={5000} rows={1} placeholder={disabled ? 'Select a conversation to start chatting' : 'Type a message (Enter to send)...'} className="min-h-[44px] max-h-32 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#FF6B00] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100 placeholder:text-slate-400 sm:text-sm" /><Button type="submit" disabled={disabled || sending || !text.trim()} isLoading={sending} aria-label="Send message" className="min-h-[44px] shrink-0 rounded-xl px-3.5 sm:px-4" leftIcon={<Send className="h-4 w-4" />}><span className="hidden sm:inline">Send</span></Button></form>
}
