import { ArrowRight, Building2, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Establishment } from '../types'
import { Card, CardFooter } from '../../../shared/components/cards'
import { Badge } from '../../../shared/components/ui/Badge'

export function EstablishmentCard({ establishment }: { establishment: Establishment }) {
  return (
    <Card variant="interactive" padding="sm" className="h-full">
      <Link to={`/establishments/${establishment.id}`} className="group block h-full min-w-0">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{establishment.establishment_type || 'Venue'}</p>
          <h3 className="mt-2 break-words text-base font-black text-slate-900 sm:text-lg">{establishment.name}</h3>
        </div>
        <VerificationBadge verified={establishment.is_verified} />
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex min-w-0 items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B00]" /><span className="break-words">{establishment.location}</span></div>
        <div className="flex min-w-0 items-start gap-2"><Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B00]" /><span className="break-words">{establishment.address}</span></div>
      </div>

      <CardFooter className="mt-4 items-start sm:items-center">
        <span className="text-xs font-medium text-slate-500">{establishment.verified_employers_count ?? 0} verified employers</span>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF6B00]">
          View profile <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </CardFooter>
      </Link>
    </Card>
  )
}

export function VerificationBadge({ verified }: { verified: boolean }) {
  return <Badge variant={verified ? 'success' : 'warning'} size="sm">{verified ? 'Verified' : 'Pending'}</Badge>
}
