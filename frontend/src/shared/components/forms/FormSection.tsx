import React from 'react'

export interface FormSectionProps {
  title: string
  description?: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  children: React.ReactNode
  className?: string
  divider?: boolean
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon,
  badge,
  children,
  className = '',
  divider = true,
}) => {
  return (
    <div className={`space-y-4 ${divider ? 'pb-6 mb-6 border-b border-slate-200 last:border-b-0 last:pb-0 last:mb-0' : ''} ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {icon && (
            <div className="mt-0.5 rounded-lg bg-orange-50 p-1.5 text-[#FF6B00]">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">{title}</h3>
            {description && <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{description}</p>}
          </div>
        </div>
        {badge && <div>{badge}</div>}
      </div>

      <div className="space-y-4 pt-1">{children}</div>
    </div>
  )
}
