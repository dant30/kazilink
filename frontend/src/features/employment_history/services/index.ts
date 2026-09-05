import { endpoints } from '../../../core/api'
import type { EmploymentHistoryListResponse, EmploymentRecord, EmploymentRecordInput, HistoryAccessLog } from '../types'

export type { EmploymentHistoryListResponse, EmploymentRecord, EmploymentRecordInput, HistoryAccessLog }

function results(value: EmploymentHistoryListResponse) {
  return Array.isArray(value) ? value : value.results ?? []
}

export function listEmploymentHistory() {
  return endpoints.employmentHistory.mine()
}

export function getEmploymentRecord(id: number) {
  return endpoints.employmentHistory.detail(id)
}

export function createEmploymentRecord(data: EmploymentRecordInput) {
  return endpoints.employmentHistory.create(data)
}

export function updateEmploymentRecord(id: number, data: Partial<EmploymentRecordInput>) {
  return endpoints.employmentHistory.update(id, data)
}

export function deleteEmploymentRecord(id: number) {
  return endpoints.employmentHistory.remove(id)
}

export function unlockEmploymentHistory(workerId: number, idempotencyKey?: string) {
  return endpoints.employmentHistory.unlock({ worker_id: workerId, idempotency_key: idempotencyKey })
}

export function getHistoryAccess() {
  return endpoints.employmentHistory.access()
}

export function consentToHistorySharing(consent: boolean) {
  return endpoints.employmentHistory.consent(consent)
}

export function getWorkerEmploymentHistory(workerId: number) {
  return endpoints.employmentHistory.worker(workerId)
}

export function getVerificationQueue() {
  return endpoints.employmentHistory.verificationQueue()
}

export function verifyEmploymentRecord(id: number, status: 'verified' | 'rejected', notes = '') {
  return endpoints.employmentHistory.verify(id, { status, notes })
}

export function normalizeEmploymentRecords(data: EmploymentHistoryListResponse) {
  return results(data)
}

