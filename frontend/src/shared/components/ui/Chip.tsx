import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../../core/utils/cn'

export interface ChipProps {
  children: ReactNode
  color?: 'neutral' | 'orange' | 'blue' | 'green' | 'rose'
  onRemove?: () => void
  removeLabel?: string
  className?: string
}

const colorClasses = {
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
  orange: 'border-orange-200 bg-orange-50 text-orange-800',
  blue: 'border-blue-200 bg-blue-50 text-blue-800',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  rose: 'border-rose-200 bg-rose-50 text-rose-800',
}

export function Chip({ children, color = 'neutral', onRemove, removeLabel = 'Remove', className }: ChipProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold', colorClasses[color], className)}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full p-0.5 transition hover:bg-black/10"
          aria-label={removeLabel}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
