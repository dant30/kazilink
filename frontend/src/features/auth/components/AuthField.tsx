import { useState, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { FormField } from '../../../shared/components/forms/FormField'
import { Input } from '../../../shared/components/ui/Input'

type Props = {
  label: string
  multiline?: boolean
  helperText?: string
  error?: string
} & InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>

export function AuthField({
  label,
  multiline = false,
  helperText,
  error,
  className,
  type,
  ...props
}: Props) {
  const [showPassword, setShowPassword] = useState(false)

  if (multiline) {
    return (
      <FormField label={label} required={Boolean(props.required)} error={error} helperText={helperText}>
        <textarea
          {...props}
          rows={props.rows ?? 4}
          className={[
            'w-full rounded-2xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-150 focus:border-[#0A2540] focus:outline-none focus:ring-4 focus:ring-[#0A2540]/10',
            error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-200' : '',
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </FormField>
    )
  }

  const isPasswordField = type === 'password'

  return (
    <FormField label={label} required={Boolean(props.required)} error={error} helperText={helperText}>
      <Input
        className={className}
        type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
        {...props}
        rightIcon={
          isPasswordField ? (
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#0A2540]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          ) : undefined
        }
      />
    </FormField>
  )
}
