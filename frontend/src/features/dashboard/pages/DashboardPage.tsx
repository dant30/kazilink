// frontend/src/features/dashboard/pages/DashboardPage.tsx
import { Navigate } from 'react-router-dom'

import { useAuthStore } from '../../auth'
import { EmployerDashboardPage } from './EmployerDashboardPage'
import { WorkerDashboardPage } from './WorkerDashboardPage'

export function DashboardPage() {
	const { user } = useAuthStore()
	if (!user) return <Navigate to="/login" replace />
	if (user.is_employer && !user.is_worker) return <EmployerDashboardPage />
	return <WorkerDashboardPage />
}