// frontend/src/router/private.tsx
import type { RouteObject } from 'react-router-dom'

import { PrivateLayout, RequireAuth, Screen } from './route-pages'
import { ProfilePage } from '../features/accounts/pages'
import { ApplicationDetailPage, ApplicationsPage } from '../features/job_applications/pages'
import { JobDetailPage, JobsPage, PostJobPage } from '../features/jobs/pages'
import { DashboardPage, EmployerDashboardPage, WorkerDashboardPage } from '../features/dashboard'
import { EstablishmentDetailPage, EstablishmentsPage } from '../features/establishments/pages'
import { EmploymentHistoryPage } from '../features/employment_history/pages'

const protectedScreen = (title: string) => <RequireAuth><Screen title={title} /></RequireAuth>

export const privateRoutes: RouteObject[] = [
	{
		element: <PrivateLayout />,
		children: [
			{ path: 'dashboard', element: <RequireAuth><DashboardPage /></RequireAuth> },
			{ path: 'dashboard/worker', element: <RequireAuth><WorkerDashboardPage /></RequireAuth> },
			{ path: 'dashboard/employer', element: <RequireAuth><EmployerDashboardPage /></RequireAuth> },
			{ index: true, element: <RequireAuth><DashboardPage /></RequireAuth> },
			{ path: 'jobs', element: <RequireAuth><JobsPage /></RequireAuth> },
			{ path: 'jobs/new', element: <RequireAuth><PostJobPage /></RequireAuth> },
			{ path: 'jobs/:jobId', element: <RequireAuth><JobDetailPage /></RequireAuth> },
			{ path: 'establishments', element: <RequireAuth><EstablishmentsPage /></RequireAuth> },
			{ path: 'establishments/:establishmentId', element: <RequireAuth><EstablishmentDetailPage /></RequireAuth> },
			{ path: 'applications', element: <RequireAuth><ApplicationsPage /></RequireAuth> },
			{ path: 'applications/:applicationId', element: <RequireAuth><ApplicationDetailPage /></RequireAuth> },
			{ path: 'employment-history', element: <RequireAuth><EmploymentHistoryPage /></RequireAuth> },
			{ path: 'employment-history/:workerId', element: <RequireAuth><EmploymentHistoryPage /></RequireAuth> },
			{ path: 'messages', element: protectedScreen('Messages') },
			{ path: 'notifications', element: protectedScreen('Notifications') },
			{ path: 'payments', element: protectedScreen('Payments') },
			{ path: 'subscriptions', element: protectedScreen('Subscriptions') },
			{ path: 'ratings', element: protectedScreen('Reviews') },
			{ path: 'support', element: protectedScreen('Support') },
			{ path: 'profile', element: <RequireAuth><ProfilePage /></RequireAuth> },
		],
	},
]
