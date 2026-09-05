import { Check, ShieldAlert, ShieldCheck } from 'lucide-react'
import { ProgressBar } from '../../../shared/components/ui/ProgressBar'
import { evaluatePasswordStrength } from '../../../core/utils'

export function PasswordStrengthBar({password}: {password: string}) {
	if (!password) return null
	const result = evaluatePasswordStrength(password)
	const color = result.level === 'strong' ? 'emerald' : result.level === 'good' ? 'orange' : 'amber'
	return <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3" aria-live="polite"><ProgressBar value={result.percentage} color={color} showPercentage={false} label={<span className="flex items-center gap-1.5 font-semibold text-slate-700">{result.level === 'strong' ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> : <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />}Password strength</span>} rightLabel={<span className="text-xs font-bold text-slate-700">{result.label}</span>} /> <div className="grid gap-1 text-[11px] sm:grid-cols-2">{result.criteria.map((criterion) => <div key={criterion.id} className={criterion.met ? 'flex items-center gap-1.5 text-emerald-700' : 'flex items-center gap-1.5 text-slate-500'}>{criterion.met ? <Check className="h-3.5 w-3.5" /> : <span className="ml-1 h-1.5 w-1.5 rounded-full bg-slate-300" />}{criterion.label}</div>)}</div></div>
}
