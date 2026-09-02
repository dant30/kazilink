// frontend/src/router/public.tsx
import type { RouteObject } from 'react-router-dom'

import { LandingPage, TermsPage } from '../features/home/pages'
import { PublicLayout, UnauthorizedPage } from './route-pages'
import { ForgotPasswordPage, LoginPage, RegisterPage, VerifyPhonePage } from '../features/auth/pages'
import { JobDetailPage, JobsPage } from '../features/jobs/pages'
import { WorkersPage } from '../features/workers/pages'

export const publicRoutes: RouteObject[] = [
	{
		element: <PublicLayout />,
		children: [
			{ index: true, element: <LandingPage /> },
			{ path: 'terms', element: <TermsPage /> },
			{ path: 'login', element: <LoginPage /> },
			{ path: 'register', element: <RegisterPage /> },
			{ path: 'verify-phone', element: <VerifyPhonePage /> },
			{ path: 'forgot-password', element: <ForgotPasswordPage /> },
			{ path: 'jobs', element: <JobsPage /> },
			{ path: 'jobs/:jobId', element: <JobDetailPage /> },
			{ path: 'workers', element: <WorkersPage /> },
			{ path: 'unauthorized', element: <UnauthorizedPage /> },
		],
	},
]
