import type { Job } from '../../jobs/types'
import type { JobApplication } from '../../job_applications/types'
import type { Establishment } from '../../establishments/types'
import type { WorkerProfile } from '../../workers/types'

export type DashboardSnapshot = {
  jobs: Job[]
  applications: JobApplication[]
  establishments: Establishment[]
  workerProfile: WorkerProfile | null
  unreadNotifications: number
  activeConversations: number
}
