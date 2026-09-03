import { ArrowRight, Building2, MapPin, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Establishment } from '../types'
import { Badge } from '../../../shared/components/ui/Badge'

export function EstablishmentCard({ establishment }: { establishment: Establishment }) {
  return (
    <Link
      to={`/establishments/${establishment.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{establishment.establishment_type || 'Venue'}</p>
          <h3 className="mt-2 text-lg font-black text-slate-900">{establishment.name}</h3>
        </div>
        <VerificationBadge verified={establishment.is_verified} />
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#FF6B00]" /> {establishment.location}</div>
        <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-[#FF6B00]" /> {establishment.address}</div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs font-medium text-slate-500">{establishment.verified_employers_count ?? 0} verified employers</span>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B00]">
          View profile <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

export function VerificationBadge({ verified }: { verified: boolean }) {
  return <Badge variant={verified ? 'success' : 'warning'} size="sm">{verified ? 'Verified' : 'Pending'}</Badge>
}
