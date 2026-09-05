import { Building2, ShieldCheck, Sparkles } from 'lucide-react'

const VENUE_TYPES = ['Restaurants', 'Hotels', 'Lounges', 'Cafes', 'Event teams', 'Homes']

export function VenuePartners() {
  return <section className="border-y border-slate-200 bg-white py-10"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"><div className="max-w-sm"><div className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B00]/10 px-2.5 py-1 text-[11px] font-bold text-[#FF6B00]"><Sparkles className="h-3 w-3" />Built for everyday hiring</div><h2 className="mt-2 text-lg font-black text-[#0A2540]">One network for trusted work</h2><p className="mt-1 text-xs leading-relaxed text-slate-500">From a weekend shift to a full-time household role, match with people who fit the work.</p></div><div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:max-w-3xl lg:grid-cols-6">{VENUE_TYPES.map((type) => <div key={type} className="flex flex-col items-center gap-1 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-center"><Building2 className="h-4 w-4 text-[#0A2540]" /><span className="text-[11px] font-bold text-slate-700">{type}</span><span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-600"><ShieldCheck className="h-2.5 w-2.5" />Open to verify</span></div>)}</div></div></section>
}
