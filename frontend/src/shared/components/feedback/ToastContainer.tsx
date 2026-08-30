import React, { useState, useEffect } from 'react'
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

  useEffect(() => {
    const handleNewToast: ToastListener = (newToast) => {
      setInternalToasts((prev) => [...prev, newToast])
      setTimeout(() => {
        setInternalToasts((prev) => prev.filter((t) => t.id !== newToast.id))
      }, 4000)
    }

    listeners.add(handleNewToast)
    return () => {
      listeners.delete(handleNewToast)
    }
  }, [])

  const activeToasts = propToasts ?? internalToasts
  const handleRemove = propRemoveToast ?? ((id: Toast['id']) => {
    setInternalToasts((prev) => prev.filter((t) => t.id !== id))
  })

  if (!activeToasts || activeToasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {activeToasts.map((t) => (
        <div
          key={t.id}
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
            onClick={() => handleRemove(t.id)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
