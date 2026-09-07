// frontend/src/shared/components/cards/Card.tsx
import React, { type ReactNode, type HTMLAttributes } from 'react'
import { cn } from '../../../core/utils/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'dark' | 'gradient' | 'interactive'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({
  variant = 'default',
  padding = 'md',
  children,
  className,
  onClick,
  ...rest
}: CardProps) {
  const variantStyles = {
    default: 'border border-slate-200/90 bg-white text-slate-900 shadow-xs',
    flat: 'border border-slate-200/70 bg-slate-50/70 text-slate-900',
    dark: 'border border-slate-800 bg-[#0A2540] text-white shadow-md',
    gradient:
      'border border-orange-200/70 bg-gradient-to-br from-white via-orange-50/20 to-amber-50/10 text-slate-900 shadow-xs',
    interactive:
      'border border-slate-200/90 bg-white text-slate-900 shadow-xs hover:border-[#FF6B00]/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-[0.99]',
  }[variant]

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }[padding]

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn('min-w-0 max-w-full overflow-hidden rounded-2xl transition-all duration-200', variantStyles, paddingStyles, className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export interface CardHeaderProps {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  badge?: ReactNode
  className?: string
  children?: ReactNode
}

export function CardHeader({
  title,
  description,
  icon,
  action,
  badge,
  className = '',
  children,
}: CardHeaderProps) {
  return (
    <div className={cn('flex min-w-0 flex-wrap items-start justify-between gap-3 mb-4', className)}>
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FF6B00]">
            {icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {typeof title === 'string' ? (
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 truncate">
                {title}
              </h3>
            ) : (
              title
            )}
            {badge}
          </div>
          {description && (
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 line-clamp-2">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
      {action && <div className="max-w-full shrink-0">{action}</div>}
    </div>
  )
}

export function CardTitle({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h3 className={cn('font-display font-bold text-lg text-slate-900 tracking-tight', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <p className={cn('text-xs sm:text-sm text-slate-500 leading-relaxed', className)}>{children}</p>
}

export interface CardMetaItem {
  icon?: ReactNode
  label?: string
  value: ReactNode
}

export function CardMeta({
  items,
  className = '',
}: {
  items: CardMetaItem[]
  className?: string
}) {
  return (
    <div className={cn('flex min-w-0 flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs text-slate-600', className)}>
      {items.map((item, idx) => (
        <div key={idx} className="inline-flex min-w-0 max-w-full items-center gap-1.5 font-medium">
          {item.icon && <span className="text-[#FF6B00]">{item.icon}</span>}
          {item.label && <span className="text-slate-400">{item.label}:</span>}
          <span className="min-w-0 break-words font-semibold text-slate-800">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export function CardContent({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('space-y-3', className)}>{children}</div>
}

export function CardFooter({
  children,
  className = '',
  divider = true,
}: {
  children: ReactNode
  className?: string
  divider?: boolean
}) {
  return (
    <div
      className={cn(
        'mt-4 flex flex-wrap items-center justify-between gap-3 pt-3',
        divider ? 'border-t border-slate-100' : '',
        className,
      )}
    >
      {children}
    </div>
  )
}
