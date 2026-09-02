// frontend/src/router/admin.tsx
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import { AdminLayout, RequireAdmin, RequireAuth, Screen } from './route-pages'
import { AdminDashboardPage } from '../features/admin'
import { AdminUsersPage } from '../features/admin/pages/accounts'
import { AdminEstablishmentsPage } from '../features/admin/pages/establishments'
import { AdminEmploymentVerificationPage } from '../features/admin/pages/employment_history'
import { AdminWorkersPage } from '../features/admin/pages/workers/AdminWorkersPage'
import { AdminEmployersPage } from '../features/admin/pages/employers/AdminEmployersPage'
import { FraudAlertsPage } from '../features/fraud/pages'
import { AdminApplicationsPage } from '../features/admin/pages/applications'
import { AdminPaymentsPage } from '../features/admin/pages/payments'
import { AdminJobsPage } from '../features/admin/pages/jobs'
import { AdminSupportPage } from '../features/admin/pages/support'
import { AdminRatingsPage } from '../features/admin/pages/ratings'
import { AdminSubscriptionsPage } from '../features/admin/pages/subscriptions'
import { AdminAuditPage } from '../features/admin/pages/audit'
import { AdminAnalyticsPage } from '../features/admin/pages/analytics'

const adminScreen = (title: string) => <RequireAuth><RequireAdmin><Screen title={title} /></RequireAdmin></RequireAuth>

export const adminRoutes: RouteObject[] = [
	{
		path: 'admin',
		element: <AdminLayout />,
		children: [
			{ index: true, element: <RequireAuth><RequireAdmin><AdminDashboardPage /></RequireAdmin></RequireAuth> },
			{ path: 'profile', element: adminScreen('Profile') },
			{ path: 'analytics', element: <RequireAuth><RequireAdmin><AdminAnalyticsPage /></RequireAdmin></RequireAuth> },
			{ path: 'audit', element: <RequireAuth><RequireAdmin><AdminAuditPage /></RequireAdmin></RequireAuth> },
			{ path: 'fraud', element: <RequireAuth><RequireAdmin><FraudAlertsPage /></RequireAdmin></RequireAuth> },
			{ path: 'fraud-alerts', element: <Navigate to="/admin/fraud" replace /> },
			{ path: 'support', element: <RequireAuth><RequireAdmin><AdminSupportPage /></RequireAdmin></RequireAuth> },
			{ path: 'payments', element: <RequireAuth><RequireAdmin><AdminPaymentsPage /></RequireAdmin></RequireAuth> },
			{ path: 'subscriptions', element: <RequireAuth><RequireAdmin><AdminSubscriptionsPage /></RequireAdmin></RequireAuth> },
			{ path: 'users', element: <RequireAuth><RequireAdmin><AdminUsersPage /></RequireAdmin></RequireAuth> },
			{ path: 'workers', element: <RequireAuth><RequireAdmin><AdminWorkersPage /></RequireAdmin></RequireAuth> },
			{ path: 'employers', element: <RequireAuth><RequireAdmin><AdminEmployersPage /></RequireAdmin></RequireAuth> },
			{ path: 'jobs', element: <RequireAuth><RequireAdmin><AdminJobsPage /></RequireAdmin></RequireAuth> },
			{ path: 'establishments', element: <RequireAuth><RequireAdmin><AdminEstablishmentsPage /></RequireAdmin></RequireAuth> },
			{ path: 'applications', element: <RequireAuth><RequireAdmin><AdminApplicationsPage /></RequireAdmin></RequireAuth> },
			{ path: 'employment-history', element: <RequireAuth><RequireAdmin><AdminEmploymentVerificationPage /></RequireAdmin></RequireAuth> },
			{ path: 'verification-queue', element: <Navigate to="/admin/employment-history" replace /> },
			{ path: 'messaging', element: adminScreen('Conversations') },
			{ path: 'ratings', element: <RequireAuth><RequireAdmin><AdminRatingsPage /></RequireAdmin></RequireAuth> },
		],
	},
]
