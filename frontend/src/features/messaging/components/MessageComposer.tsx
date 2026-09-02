import { FormEvent, useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'

export function MessageComposer({ onSend, sending, disabled }: { onSend: (text: string) => Promise<unknown>; sending?: boolean; disabled?: boolean }) {
  const [text, setText] = useState('')
  const submit = async (event: FormEvent) => { event.preventDefault(); if (!text.trim()) return; await onSend(text); setText('') }
  return <form onSubmit={submit} className="flex items-end gap-3 border-t border-slate-200 bg-white p-4"><textarea value={text} onChange={(event) => setText(event.target.value)} disabled={disabled || sending} maxLength={5000} rows={2} placeholder="Write a message..." className="min-h-11 flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 disabled:bg-slate-50" /><Button type="submit" disabled={disabled || sending || !text.trim()} isLoading={sending} aria-label="Send message" leftIcon={<Send className="h-4 w-4" />}>Send</Button></form>
}
