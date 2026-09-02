import React, { useState, useEffect, useRef } from 'react'
import type { FC } from 'react'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

export interface Toast {
  id: string | number
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

interface ToastContainerProps {
  toasts?: Toast[]
  removeToast?: (id: Toast['id']) => void
}

type ToastListener = (toast: Toast) => void
const listeners = new Set<ToastListener>()

export const toast = {
  show: (type: Toast['type'], title: string, message: string) => {
    const newToast: Toast = {
      id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      title,
      message,
    }
    listeners.forEach((listener) => listener(newToast))
  },
  success: (title: string, message = '') => toast.show('success', title, message),
  error: (title: string, message = '') => toast.show('error', title, message),
  warning: (title: string, message = '') => toast.show('warning', title, message),
  info: (title: string, message = '') => toast.show('info', title, message),
}

export const ToastContainer: FC<ToastContainerProps> = ({ toasts: propToasts, removeToast: propRemoveToast }) => {
  const [internalToasts, setInternalToasts] = useState<Toast[]>([])
  const timers = useRef(new Map<Toast['id'], ReturnType<typeof setTimeout>>())

  const removeInternalToast = (id: Toast['id']) => {
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
    setInternalToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  useEffect(() => {
    const handleNewToast: ToastListener = (newToast) => {
      setInternalToasts((prev) => [...prev, newToast])
      const timer = setTimeout(() => removeInternalToast(newToast.id), 4000)
      timers.current.set(newToast.id, timer)
    }

    listeners.add(handleNewToast)
    return () => {
      listeners.delete(handleNewToast)
      timers.current.forEach((timer) => clearTimeout(timer))
      timers.current.clear()
    }
  }, [])

  const rawToasts = propToasts !== undefined ? propToasts : internalToasts
  const activeToasts = Array.isArray(rawToasts) ? rawToasts : []
  const handleRemove = propRemoveToast ?? removeInternalToast

  if (!activeToasts || activeToasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 pointer-events-none" aria-live="polite" aria-atomic="false">
      {activeToasts.map((t) => (
        <div
          key={t.id}
          role={t.type === 'error' ? 'alert' : 'status'}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur-md flex items-start gap-3 transform transition-all duration-300 animate-slide-up ${
            t.type === 'success'
              ? 'bg-[#0A2540] text-white border-emerald-500/30'
              : t.type === 'error'
              ? 'bg-rose-950 text-white border-rose-700'
              : t.type === 'warning'
              ? 'bg-amber-950 text-white border-amber-700'
              : 'bg-[#0A2540] text-white border-slate-700'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#FF6B00]" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
          </div>
          <div className="flex-1 text-left">
            <h5 className="font-bold text-xs">{t.title}</h5>
            {t.message && <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{t.message}</p>}
          </div>
          <button
            type="button"
            onClick={() => handleRemove(t.id)}
            aria-label={`Dismiss ${t.title}`}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
