import React from 'react'

import { BackToTop } from '../components/ui/BackToTop'
import { FloatingButton } from './FloatingButton'
import { Footer } from './Footer'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '../../features/auth/store'
import { ToastContainer } from '../components/feedback'

interface MainLayoutProps {
	children: React.ReactNode
	admin?: boolean
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, admin = false }) => {
	const { user, tokens } = useAuthStore()

	let storedUser: {
		is_staff?: boolean
		is_superuser?: boolean
		is_employer?: boolean
		is_worker?: boolean
	} | null = user ?? null

	if (!storedUser) {
		try {
			storedUser = JSON.parse(localStorage.getItem('kazilink.user') ?? 'null') as typeof storedUser
		} catch {
			storedUser = null
		}
	}

	const signedIn = Boolean(tokens || user || localStorage.getItem('kazilink.access_token') || storedUser)
	const isAdmin = admin || Boolean(storedUser?.is_staff || storedUser?.is_superuser)

	return (
		<div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-[#FF6B00] selection:text-white">
			<Header />
			<div className="flex flex-1 w-full relative items-start">
				{/* Sidebar is ONLY visible when a user is authenticated */}
				{signedIn && <Sidebar admin={isAdmin} />}
				<main className="flex-1 w-full min-w-0">{children}</main>
			</div>
			<Footer />
			<FloatingButton />
			<BackToTop />
			<ToastContainer />
		</div>
	)
}
