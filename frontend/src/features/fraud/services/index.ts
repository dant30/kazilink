import { endpoints } from '../../../core/api'
import type { FraudAlert, FraudAlertListResponse } from '../types'

const results = (value: FraudAlertListResponse) => Array.isArray(value) ? value : value.results

export const fraudServices = {
	async listAlerts(status?: string, severity?: string): Promise<FraudAlert[]> {
		const params = new URLSearchParams()
		if (status) params.set('status', status)
		if (severity) params.set('severity', severity)
		return results(await endpoints.fraud.list(params.toString()) as FraudAlertListResponse)
	},
	getAlert: (id: number) => endpoints.fraud.detail(id),
	resolve: (id: number, status: 'resolved' | 'dismissed') => endpoints.fraud.updateStatus(id, status),
}
