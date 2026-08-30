import React from 'react'
import { AlertCircle, X } from 'lucide-react'

export interface ValidationErrorsProps {
  errors?: string[] | Record<string, string | string[]> | null
  title?: string
  onDismiss?: () => void
  className?: string
}

export const ValidationErrors: React.FC<ValidationErrorsProps> = ({
  errors,
  title = 'Please correct the following issues:',
  onDismiss,
  className = '',
}) => {
  if (!errors) return null

  let errorList: string[] = []

  if (Array.isArray(errors)) {
    errorList = errors.filter(Boolean)
  } else if (typeof errors === 'object') {
    Object.entries(errors).forEach(([field, msg]) => {
      if (Array.isArray(msg)) {
        msg.forEach((m) => errorList.push(`${field}: ${m}`))
      } else if (typeof msg === 'string' && msg) {
        errorList.push(`${field}: ${msg}`)
      }
    })
  }

  if (errorList.length === 0) return null

  return (
    <div
      role="alert"
      className={`rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-rose-900 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-rose-900">{title}</h4>
            <ul className="mt-1.5 list-disc pl-4 space-y-1 text-xs text-rose-700">
              {errorList.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-rose-400 hover:text-rose-700 p-1 rounded-lg transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
