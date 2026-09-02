import { endpoints } from '../../../core/api'
import type { EmployerProfile, UpdateEmployerProfilePayload } from '../types'

export const employerServices = {
	getMyProfile: (): Promise<EmployerProfile> => endpoints.auth.employerProfile(),
	updateMyProfile: (data: UpdateEmployerProfilePayload): Promise<EmployerProfile> => endpoints.auth.updateEmployerProfile(data),
	async getMyEstablishments() {
		const result = await endpoints.establishments.mine()
		return Array.isArray(result) ? result : result.results
	},
}
