// frontend/src/router/admin.tsx
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import { AdminLayout, RequireAdmin, RequireAuth, Screen } from './route-pages'
import { AdminDashboardPage } from '../features/admin'
import { AdminUsersPage } from '../features/admin/pages/accounts'
import { AdminEstablishmentsPage } from '../features/admin/pages/establishments'
import { AdminEmploymentVerificationPage } from '../features/admin/pages/employment_history'

const adminScreen = (title: string) => <RequireAuth><RequireAdmin><Screen title={title} /></RequireAdmin></RequireAuth>

export const adminRoutes: RouteObject[] = [
	{
		path: 'admin',
		element: <AdminLayout />,
		children: [
			{ index: true, element: <RequireAuth><RequireAdmin><AdminDashboardPage /></RequireAdmin></RequireAuth> },
			{ path: 'profile', element: adminScreen('Profile') },
			{ path: 'analytics', element: adminScreen('Analytics') },
			{ path: 'audit', element: adminScreen('Audit log') },
			{ path: 'fraud', element: adminScreen('Fraud alerts') },
			{ path: 'fraud-alerts', element: <Navigate to="/admin/fraud" replace /> },
			{ path: 'support', element: adminScreen('Support queue') },
			{ path: 'payments', element: adminScreen('Payment transactions') },
			{ path: 'subscriptions', element: adminScreen('Subscriptions') },
			{ path: 'users', element: <RequireAuth><RequireAdmin><AdminUsersPage /></RequireAdmin></RequireAuth> },
			{ path: 'jobs', element: adminScreen('Jobs') },
			{ path: 'establishments', element: <RequireAuth><RequireAdmin><AdminEstablishmentsPage /></RequireAdmin></RequireAuth> },
			{ path: 'applications', element: adminScreen('Applications') },
			{ path: 'employment-history', element: <RequireAuth><RequireAdmin><AdminEmploymentVerificationPage /></RequireAdmin></RequireAuth> },
			{ path: 'verification-queue', element: <Navigate to="/admin/employment-history" replace /> },
			{ path: 'messaging', element: adminScreen('Conversations') },
			{ path: 'ratings', element: adminScreen('Reviews') },
		],
	},
]
