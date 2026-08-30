import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { adminRoutes } from './router/admin'
import { privateRoutes } from './router/private'
import { NotFound } from './router/route-pages'
import { publicRoutes } from './router/public'

const router = createBrowserRouter([
	...publicRoutes,
	...privateRoutes,
	...adminRoutes,
	{ path: '*', element: <NotFound /> },
])

export function App() {
	return <RouterProvider router={router} />
}
