import { endpoints } from '../../../core/api'
import type { AuditLog } from '../../audit/types'

export async function listAdminAuditLogs(): Promise<AuditLog[]> {
  const response = await endpoints.audit.adminList()
  return Array.isArray(response) ? response : response.results
}
