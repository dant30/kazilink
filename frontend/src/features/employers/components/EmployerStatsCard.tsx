import type { EmployerProfile } from '../types'

export function EmployerStatsCard({ profile }: { profile: EmployerProfile }) {
  const responseTime = profile.average_response_time_minutes
  const responseLabel = responseTime === 0 ? 'Not available' : responseTime < 60 ? `${responseTime}m` : `${Math.round(responseTime / 60)}h`
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
    <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">Quick stats</h3>
    <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
      {([['Open roles', profile.active_jobs_count], ['Total hires', profile.total_hires], ['Avg. response', responseLabel]] as const).map(([label, value]) => <div key={label} className="rounded-xl bg-white p-3"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p><p className="mt-1 text-2xl font-black text-[#0A2540]">{value}</p></div>)}
    </div>
  </div>
}
