// frontend/src/shared/components/ui/PageHeader.tsx
import React, { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'

export interface PageHeaderBreadcrumb {
  label: string
  href?: string
  onClick?: () => void
}

export interface PageHeaderMetadataItem {
  icon?: ReactNode
  label?: string
  value: ReactNode
}

export interface PageHeaderBadge {
  text: string
  variant?: 'orange' | 'emerald' | 'blue' | 'amber' | 'neutral'
}

export interface PageHeaderStatus {
  label: string
  indicator?: 'online' | 'busy' | 'verified' | 'neutral'
}

export interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  icon?: ReactNode
  actions?: ReactNode
  children?: ReactNode
  variant?: 'dark' | 'light' | 'primary' | 'minimal'
  className?: string
  // Navigation & Hierarchy
  breadcrumbs?: PageHeaderBreadcrumb[]
  onBack?: () => void
  backHref?: string
  backLabel?: string
  // Meta tags & Indicators
  badge?: ReactNode | PageHeaderBadge
  status?: PageHeaderStatus
  metadata?: PageHeaderMetadataItem[] | ReactNode
  // Tab strip slot docked at header bottom
  tabs?: ReactNode
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  actions,
  children,
  variant = 'dark',
  className = '',
  breadcrumbs,
  onBack,
  backHref,
  backLabel = 'Back',
  badge,
  status,
  metadata,
  tabs,
}: PageHeaderProps) {
  const dark = variant === 'dark'
  const isPrimary = variant === 'primary'
  const isMinimal = variant === 'minimal'

  // Variant background styles
  const getContainerStyles = () => {
    if (isMinimal) {
      return 'border-b border-slate-200 bg-transparent text-slate-900 pb-5'
    }
    if (isPrimary) {
      return 'border border-orange-500/20 bg-gradient-to-br from-[#FF6B00] to-[#CC5500] text-white shadow-md'
    }
    if (dark) {
      return 'border border-slate-800/80 bg-gradient-to-br from-[#0A2540] via-[#0E2E4E] to-[#051424] text-white shadow-xs'
    }
    return 'border border-slate-200/90 bg-white text-slate-900 shadow-xs'
  }

  // Render badge helper
  const renderBadge = () => {
    if (!badge) return null
    if (React.isValidElement(badge)) return badge

    const b = badge as PageHeaderBadge
    const badgeColors = {
      orange: dark
        ? 'bg-[#FF6B00]/20 text-[#FF8833] border border-[#FF6B00]/30'
        : 'bg-orange-50 text-[#FF6B00] border border-orange-200',
      emerald: dark
        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        : 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      blue: dark
        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
        : 'bg-blue-50 text-blue-700 border border-blue-200',
      amber: dark
        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
        : 'bg-amber-50 text-amber-700 border border-amber-200',
      neutral: dark
        ? 'bg-white/10 text-slate-200 border border-white/15'
        : 'bg-slate-100 text-slate-700 border border-slate-200',
    }[b.variant || 'orange']

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${badgeColors}`}>
        {b.text}
      </span>
    )
  }

  // Render status indicator dot
  const renderStatus = () => {
    if (!status) return null
    const dotColors = {
      online: 'bg-emerald-400 ring-emerald-400/30',
      busy: 'bg-rose-400 ring-rose-400/30',
      verified: 'bg-[#FF6B00] ring-[#FF6B00]/30',
      neutral: 'bg-slate-400 ring-slate-400/30',
    }[status.indicator || 'online']

    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
          dark ? 'bg-white/10 text-slate-200' : 'bg-slate-100 text-slate-700'
        }`}
      >
        <span className={`h-2 w-2 rounded-full ring-4 ${dotColors}`} />
        <span>{status.label}</span>
      </div>
    )
  }

  // Render back navigation button
  const renderBackButton = () => {
    if (!onBack && !backHref) return null

    const buttonClasses = `inline-flex items-center gap-1.5 rounded-xl text-xs font-bold transition min-h-[36px] px-3 py-1.5 ${
      dark || isPrimary
        ? 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95'
    }`

    if (backHref) {
      return (
        <Link to={backHref} className={buttonClasses}>
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{backLabel}</span>
        </Link>
      )
    }

    return (
      <button type="button" onClick={onBack} className={buttonClasses}>
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{backLabel}</span>
      </button>
    )
  }

  // Render metadata chips
  const renderMetadata = () => {
    if (!metadata) return null
    if (React.isValidElement(metadata)) return metadata

    const items = metadata as PageHeaderMetadataItem[]
    return (
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs ${
              dark
                ? 'bg-white/10 text-slate-300 border border-white/10'
                : 'bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            {item.icon && <span className="shrink-0 text-[#FF6B00]">{item.icon}</span>}
            {item.label && <span className="text-slate-400 font-medium">{item.label}:</span>}
            <span className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <header
      className={`relative overflow-hidden rounded-3xl ${
        isMinimal ? 'p-0' : 'p-6 sm:p-8'
      } ${getContainerStyles()} ${className}`}
    >
      {/* Decorative subtle ambient glows for dark / primary variants */}
      {dark && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF6B00]/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"
          />
        </>
      )}

      {/* Top Bar: Breadcrumbs & Back Button */}
      {(breadcrumbs || onBack || backHref) && (
        <div className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            {renderBackButton()}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs">
                {breadcrumbs.map((crumb, i) => {
                  const isLast = i === breadcrumbs.length - 1
                  return (
                    <React.Fragment key={i}>
                      {i > 0 && (
                        <ChevronRight
                          className={`h-3 w-3 ${dark ? 'text-slate-500' : 'text-slate-400'}`}
                        />
                      )}
                      {crumb.href && !isLast ? (
                        <Link
                          to={crumb.href}
                          className={`transition ${
                            dark
                              ? 'text-slate-300 hover:text-white'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {crumb.label}
                        </Link>
                      ) : crumb.onClick && !isLast ? (
                        <button
                          type="button"
                          onClick={crumb.onClick}
                          className={`transition ${
                            dark
                              ? 'text-slate-300 hover:text-white'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {crumb.label}
                        </button>
                      ) : (
                        <span
                          className={`font-bold ${
                            isLast
                              ? dark
                                ? 'text-white'
                                : 'text-slate-900'
                              : dark
                              ? 'text-slate-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {crumb.label}
                        </span>
                      )}
                    </React.Fragment>
                  )
                })}
              </nav>
            )}
          </div>

          {status && <div className="hidden sm:block">{renderStatus()}</div>}
        </div>
      )}

      {/* Main Header Content and Actions */}
      <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3 sm:gap-4">
            {icon && (
              <span
                className={`mt-1 flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border transition ${
                  dark || isPrimary
                    ? 'border-white/15 bg-white/10 text-[#FF6B00] shadow-2xs'
                    : 'border-orange-100 bg-orange-50 text-[#FF6B00]'
                }`}
              >
                {icon}
              </span>
            )}
            <div className="min-w-0 flex-1">
              {/* Eyebrow and Status */}
              {(eyebrow || badge || status) && (
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {eyebrow && (
                    <p
                      className={`text-[11px] font-bold uppercase tracking-[0.2em] ${
                        dark
                          ? 'text-orange-400'
                          : isPrimary
                          ? 'text-orange-100'
                          : 'text-[#FF6B00]'
                      }`}
                    >
                      {eyebrow}
                    </p>
                  )}
                  {renderBadge()}
                  {status && (!breadcrumbs && !onBack && !backHref) && (
                    <div className="sm:hidden">{renderStatus()}</div>
                  )}
                </div>
              )}

              {/* Title */}
              <h1
                className={`font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${
                  dark || isPrimary ? 'text-white' : 'text-[#0A2540]'
                }`}
              >
                {title}
              </h1>

              {/* Description */}
              {description && (
                <p
                  className={`mt-2 max-w-3xl text-xs sm:text-sm leading-relaxed ${
                    dark || isPrimary ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {description}
                </p>
              )}

              {/* Metadata row */}
              {renderMetadata()}
            </div>
          </div>

          {/* Children Slot */}
          {children && <div className="mt-5">{children}</div>}
        </div>

        {/* Action Buttons Slot */}
        {actions && <div className="relative z-10 w-full shrink-0 self-start sm:w-auto sm:self-end [&>div]:flex-nowrap [&>div]:w-full [&>div>button]:min-w-0 [&>div>button]:flex-1 [&>div>button]:whitespace-nowrap [&>div>a]:min-w-0 [&>div>a]:flex-1 [&>div>a]:whitespace-nowrap sm:[&>div>button]:flex-none sm:[&>div>a]:flex-none">{actions}</div>}
      </div>

      {/* Bottom Tabs Slot */}
      {tabs && (
        <div className="relative z-10 mt-6 pt-4 border-t border-white/10">
          {tabs}
        </div>
      )}
    </header>
  )
}
