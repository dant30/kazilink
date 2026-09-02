import type { JobApplicationStatus } from '../types'
import { Badge } from '../../../shared/components/ui/Badge'

const statusLabels: Record<JobApplicationStatus, string> = {
  applied: 'Applied',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview',
  hired: 'Hired',
  rejected: 'Rejected',
}

const statusVariants: Record<JobApplicationStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  applied: 'info',
  shortlisted: 'warning',
  interview_scheduled: 'info',
  hired: 'success',
  rejected: 'danger',
}

export function ApplicationStatusBadge({ status }: { status: JobApplicationStatus }) {
  return <Badge variant={statusVariants[status]} size="sm" className="!max-w-none !whitespace-nowrap text-center normal-case tracking-normal leading-none">{statusLabels[status]}</Badge>
}
