import { endpoints } from '../../../core/api'
import type { Transaction, TransactionListResponse } from '../../payments/types'

export async function listAdminPayments(): Promise<Transaction[]> {
  const response = await endpoints.payments.adminList()
  return Array.isArray(response) ? response : response.results
}
