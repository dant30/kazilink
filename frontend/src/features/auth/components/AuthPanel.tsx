import type { ReactNode } from 'react'

import { Badge } from '../../../shared/components/ui/Badge'

export function AuthPanel({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  children: ReactNode
}) {
  const features = [
    'Verified workers and employers',
    'Transparent hiring and job matching',
    'Safer, faster hiring across Kenya',
  ]

  return (
    <section className="min-h-screen bg-slate-100 px-3 py-4 sm:px-5 lg:px-8 lg:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1.05fr_1.2fr]">
        <aside className="relative overflow-hidden bg-[#0A2540] px-5 py-6 text-white sm:px-7 lg:px-10 lg:py-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,0,0.24),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_25%)]" />

          <div className="relative z-10 flex h-full flex-col">
            <div className="space-y-4 lg:space-y-5">
              <span className="inline-flex rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-100">
                {eyebrow}
              </span>

              <div className="space-y-3">
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">{title}</h1>
                {subtitle && <p className="max-w-md text-sm leading-6 text-slate-200">{subtitle}</p>}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 lg:mt-8">
              <Badge variant="orange" size="sm" className="!rounded-full border-[#FFB980]/60 bg-[#FF6B00]/15 text-orange-100">
                Verified talent
              </Badge>
              <Badge variant="neutral" size="sm" className="!rounded-full border-white/15 bg-white/5 text-slate-100">
                Fraud checked
              </Badge>
              <Badge variant="neutral" size="sm" className="!rounded-full border-white/15 bg-white/5 text-slate-100">
                2k+ trusted venues
              </Badge>
            </div>

            <div className="mt-6 space-y-3 lg:mt-8">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF6B00] text-sm font-bold text-white">✓</span>
                  <span className="text-sm text-slate-100">{feature}</span>
                </div>
              ))}
            </div>

          </div>
        </aside>

        <div className="flex items-center justify-center bg-white px-4 py-5 sm:px-6 lg:px-12 lg:py-8">
          <div className="w-full max-w-xl">{children}</div>
        </div>
      </div>
    </section>
  )
}
