import { CheckCircle2, ShieldCheck, Users } from 'lucide-react'
import { Badge } from '../../../shared/components/ui/Badge'
import { Switch } from '../../../shared/components/ui/Switch'
import type { EmployerProfile } from '../types'

type Props = { profile: EmployerProfile; onChange: (field: 'auto_shortlist' | 'verified_only', value: boolean) => void }

export function EmployerSettingsCard({ profile, onChange }: Props) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">Hiring settings</h3><Badge variant="success" icon={<CheckCircle2 className="h-3 w-3" />}>Active</Badge></div>
    <div className="mt-5 space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"><div className="flex items-center gap-2 text-sm font-medium text-slate-700"><Users className="h-4 w-4 text-[#FF6B00]" />Auto-shortlist candidates</div><Switch checked={profile.auto_shortlist} onChange={(value) => onChange('auto_shortlist', value)} size="sm" /></div>
      <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"><div className="flex items-center gap-2 text-sm font-medium text-slate-700"><ShieldCheck className="h-4 w-4 text-[#FF6B00]" />Verified-only hiring</div><Switch checked={profile.verified_only} onChange={(value) => onChange('verified_only', value)} size="sm" /></div>
    </div>
  </div>
}
