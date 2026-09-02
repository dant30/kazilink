import type { ReactNode } from 'react'

export interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  icon?: ReactNode
  actions?: ReactNode
  children?: ReactNode
  variant?: 'dark' | 'light'
  className?: string
}

export function PageHeader({ eyebrow, title, description, icon, actions, children, variant = 'dark', className = '' }: PageHeaderProps) {
  const dark = variant === 'dark'
  return <header className={`flex flex-col justify-between gap-4 rounded-[28px] p-6 sm:flex-row sm:items-end sm:p-8 ${dark ? 'bg-[#0A2540] text-white' : 'border border-slate-200 bg-white text-slate-900'} ${className}`}>
    <div className="min-w-0">
      <div className="flex items-start gap-3">
        {icon && <span className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${dark ? 'bg-white/10 text-orange-300' : 'bg-orange-50 text-[#FF6B00]'}`}>{icon}</span>}
        <div>{eyebrow && <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${dark ? 'text-orange-300' : 'text-[#FF6B00]'}`}>{eyebrow}</p>}<h1 className={`${eyebrow ? 'mt-2' : ''} text-3xl font-black sm:text-4xl ${dark ? 'text-white' : 'text-[#0A2540]'}`}>{title}</h1>{description && <p className={`mt-2 max-w-2xl text-sm leading-6 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p>}</div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
    {actions && <div className="shrink-0">{actions}</div>}
  </header>
}
