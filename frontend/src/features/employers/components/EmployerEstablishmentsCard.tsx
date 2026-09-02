import { ShieldCheck } from 'lucide-react'
import { FormSection } from '../../../shared/components/forms'
import { Badge } from '../../../shared/components/ui/Badge'
import type { Establishment } from '../../establishments/types'

export function EmployerEstablishmentsCard({ establishments }: { establishments: Establishment[] }) {
  return <FormSection title="Establishments" description="The businesses and locations you manage." icon={<ShieldCheck className="h-4 w-4" />}>
    {establishments.length === 0 ? <p className="text-sm text-slate-500">No establishments have been added yet.</p> : <div className="space-y-3">
      {establishments.map((establishment) => <div key={establishment.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div><p className="text-sm font-black text-slate-900">{establishment.name}</p><p className="mt-1 text-xs text-slate-500">{establishment.establishment_type} · {establishment.location}</p></div>
        <Badge variant={establishment.is_verified ? 'success' : 'warning'}>{establishment.is_verified ? 'Verified' : 'Reviewing'}</Badge>
      </div>)}
    </div>}
  </FormSection>
}
