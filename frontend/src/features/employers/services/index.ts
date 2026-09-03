import { endpoints } from '../../../core/api'
import type { EmployerProfile, UpdateEmployerProfilePayload } from '../types'

export const employerServices = {
	getMyProfile: (): Promise<EmployerProfile> => endpoints.auth.employerProfile(),
	updateMyProfile: (data: UpdateEmployerProfilePayload): Promise<EmployerProfile> => endpoints.auth.updateEmployerProfile(serializeProfileUpdate(data)),
	async getMyEstablishments() {
		const result = await endpoints.establishments.mine()
		return Array.isArray(result) ? result : result.results
	},
}

function serializeProfileUpdate(data: UpdateEmployerProfilePayload): UpdateEmployerProfilePayload | FormData {
	if (!(data.avatar instanceof File)) return data
	const formData = new FormData()
	Object.entries(data).forEach(([key, value]) => {
		if (value !== undefined && value !== null) formData.append(key, value instanceof File ? value : String(value))
	})
	return formData
}
