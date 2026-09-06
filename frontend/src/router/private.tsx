// frontend/src/router/private.tsx
import type { RouteObject } from 'react-router-dom'

import { PrivateLayout, RequireAuth, Screen } from './route-pages'
import { ApplicationDetailPage, ApplicationsPage } from '../features/job_applications/pages'
import { EditJobPage, JobDetailPage, JobsPage, PostJobPage, SavedJobsPage } from '../features/jobs/pages'
import { DashboardPage, EmployerDashboardPage, WorkerDashboardPage } from '../features/dashboard'
import { EditEstablishmentPage, EstablishmentDetailPage, EstablishmentsPage } from '../features/establishments/pages'
import { EmploymentHistoryPage } from '../features/employment_history/pages'
import { EmployerProfilePage, EmployerSettingsPage } from '../features/employers/pages'
import { WorkerProfilePage, WorkerSettingsPage, WorkersPage } from '../features/workers/pages'
import { MessagingPage } from '../features/messaging/pages'
import { SubscriptionsPage } from '../features/subscriptions/pages'
import { NotificationsPage } from '../features/notifications/pages'
import { SupportPage } from '../features/support/pages'
import { RatingsPage } from '../features/ratings/pages'
import { PaymentsPage } from '../features/payments/pages'

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
			{ path: 'jobs/saved', element: <RequireAuth><SavedJobsPage /></RequireAuth> },
			{ path: 'workers', element: <RequireAuth><WorkersPage /></RequireAuth> },
			{ path: 'jobs/new', element: <RequireAuth><PostJobPage /></RequireAuth> },
			{ path: 'jobs/:jobId', element: <RequireAuth><JobDetailPage /></RequireAuth> },
			{ path: 'jobs/:jobId/edit', element: <RequireAuth><EditJobPage /></RequireAuth> },
			{ path: 'establishments', element: <RequireAuth><EstablishmentsPage /></RequireAuth> },
			{ path: 'establishments/:establishmentId', element: <RequireAuth><EstablishmentDetailPage /></RequireAuth> },
			{ path: 'establishments/:establishmentId/edit', element: <RequireAuth><EditEstablishmentPage /></RequireAuth> },
			{ path: 'applications', element: <RequireAuth><ApplicationsPage /></RequireAuth> },
			{ path: 'applications/:applicationId', element: <RequireAuth><ApplicationDetailPage /></RequireAuth> },
			{ path: 'employment-history', element: <RequireAuth><EmploymentHistoryPage /></RequireAuth> },
			{ path: 'employment-history/:workerId', element: <RequireAuth><EmploymentHistoryPage /></RequireAuth> },
			{ path: 'messages', element: <RequireAuth><MessagingPage /></RequireAuth> },
			{ path: 'notifications', element: <RequireAuth><NotificationsPage /></RequireAuth> },
			{ path: 'payments', element: <RequireAuth><PaymentsPage /></RequireAuth> },
			{ path: 'subscriptions', element: <RequireAuth><SubscriptionsPage /></RequireAuth> },
			{ path: 'ratings', element: <RequireAuth><RatingsPage /></RequireAuth> },
			{ path: 'support', element: <RequireAuth><SupportPage /></RequireAuth> },
			{ path: 'profile/worker', element: <RequireAuth><WorkerProfilePage /></RequireAuth> },
			{ path: 'profile/worker/settings', element: <RequireAuth><WorkerSettingsPage /></RequireAuth> },
			{ path: 'profile/employer', element: <RequireAuth><EmployerProfilePage /></RequireAuth> },
			{ path: 'profile/employer/settings', element: <RequireAuth><EmployerSettingsPage /></RequireAuth> },
		],
	},
]
