import type { ReactNode } from 'react'
import { Coins, ShieldCheck, Sparkles } from 'lucide-react'

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
  const features = ['Verified workers and employers with identity checks', 'Transparent M-Pesa escrow protection', 'Safer hospitality recruitment across Kenya']

  return (
    <section className="min-h-screen bg-slate-100/90 px-3 py-3 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:rounded-[28px] lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.05fr_1.2fr]">
        <aside className="relative overflow-hidden bg-[#0A2540] px-4 py-5 text-white sm:px-7 sm:py-8 lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,0,0.28),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_28%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
              <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-200"><Sparkles className="h-3 w-3 text-[#FF6B00]" />{eyebrow}</span><span className="text-[11px] font-black tracking-wider text-slate-300 lg:hidden">Kazi<span className="text-[#FF6B00]">Link</span></span></div>
              <div className="space-y-1.5 sm:space-y-2.5"><h1 className="text-xl font-black tracking-tight text-white sm:text-2xl lg:text-4xl">{title}</h1>{subtitle && <p className="max-w-md text-xs leading-relaxed text-slate-300 sm:text-sm">{subtitle}</p>}</div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:gap-2 sm:pt-2"><span className="inline-flex items-center gap-1 rounded-full border border-orange-400/30 bg-[#FF6B00]/15 px-2.5 py-1 text-[10px] font-bold text-orange-200 sm:text-xs"><ShieldCheck className="h-3 w-3 text-[#FF6B00]" />Verified talent</span><span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-200 sm:text-xs"><Coins className="h-3 w-3 text-emerald-400" />M-Pesa escrow</span><span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-200 sm:text-xs">2,000+ venues</span></div>
            </div>
            <div className="mt-4 hidden space-y-2.5 sm:mt-6 sm:block lg:mt-8 lg:space-y-3">{features.map((feature) => <div key={feature} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF6B00] text-xs font-bold text-white">✓</span><span className="text-xs text-slate-200 sm:text-sm">{feature}</span></div>)}</div>
          </div>
        </aside>

        <div className="flex items-center justify-center bg-white px-4 py-5 sm:px-6 lg:px-12 lg:py-8">
          <div className="w-full max-w-xl">{children}</div>
        </div>
      </div>
    </section>
  )
}
