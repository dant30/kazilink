// frontend/src/features/auth/components/AuthField.tsx
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

type Props = { label: string; multiline?: boolean } & InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>

export function AuthField({ label, multiline = false, className, ...props }: Props) {
  const fieldClassName = ['auth-input', className].filter(Boolean).join(' ')

  return (
    <label className="auth-field">
      <span className="auth-field__label">{label}</span>
      {multiline ? <textarea {...props} className={fieldClassName} /> : <input {...props} className={fieldClassName} />}
    </label>
  )
}
