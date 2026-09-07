// frontend/src/shared/layouts/MobileBottomNav.tsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
	Award,
	Briefcase,
	FileText,
	Home,
	LogIn,
	MessageSquare,
	ShieldCheck,
	UserCheck,
	Users,
} from 'lucide-react'

import { useAuthStore } from '../../features/auth/store'
import { localStorageStore } from '../../core/storage'
import { useNotifications } from '../../features/notifications/hooks/useNotifications'
import { ACCESS_TOKEN_KEY } from '../../core/api'

export const MobileBottomNav: React.FC = () => {
	const location = useLocation()
	const { user } = useAuthStore()

	let storedUser: {
		is_staff?: boolean
		is_superuser?: boolean
		is_employer?: boolean
		is_worker?: boolean
	} | null = user ?? null

	if (!storedUser) {
		try {
			storedUser = localStorageStore.get<typeof storedUser>('user')
		} catch {
			storedUser = null
		}
	}

	const signedIn = localStorageStore.has(ACCESS_TOKEN_KEY) || Boolean(user || storedUser)
	const isAdmin = Boolean(storedUser?.is_staff || storedUser?.is_superuser)
	const isEmployer = Boolean(storedUser?.is_employer && !storedUser?.is_worker)
	const isWorker = Boolean(storedUser?.is_worker)

	const { notifications } = useNotifications({ enabled: signedIn })
	const unreadCount = notifications.filter((n) => !n.is_read).length

	type NavItem = {
		label: string
		path: string
		icon: React.ComponentType<{ className?: string }>
		badge?: number
		exact?: boolean
	}

	let items: NavItem[] = []

	if (!signedIn) {
		items = [
			{ label: 'Home', path: '/', icon: Home, exact: true },
			{ label: 'Find Shifts', path: '/jobs', icon: Briefcase },
			{ label: 'Talent', path: '/workers', icon: Users },
			{ label: 'Sign In', path: '/login', icon: LogIn },
		]
	} else if (isAdmin) {
		items = [
			{ label: 'Ops Desk', path: '/admin', icon: ShieldCheck, exact: true },
			{ label: 'Users', path: '/admin/users', icon: Users },
			{ label: 'Verify', path: '/admin/employment-history', icon: Award },
			{ label: 'Jobs', path: '/admin/jobs', icon: Briefcase },
			{ label: 'Profile', path: '/admin/profile', icon: UserCheck },
		]
	} else if (isEmployer) {
		items = [
			{ label: 'Hub', path: '/dashboard/employer', icon: Home, exact: true },
			{ label: 'My Shifts', path: '/jobs', icon: Briefcase },
			{ label: 'Candidates', path: '/workers', icon: UserCheck },
			{ label: 'Messages', path: '/messages', icon: MessageSquare },
			{ label: 'Profile', path: '/profile/employer', icon: Award },
		]
	} else {
		// Worker
		items = [
			{ label: 'Dashboard', path: '/dashboard/worker', icon: Home, exact: true },
			{ label: 'Shifts', path: '/jobs', icon: Briefcase },
			{ label: 'Applied', path: '/applications', icon: FileText },
			{ label: 'Messages', path: '/messages', icon: MessageSquare },
			{ label: 'Passport', path: '/profile/worker', icon: UserCheck, badge: unreadCount > 0 ? unreadCount : undefined },
		]
	}

	return (
		<nav
			aria-label="Mobile navigation"
			className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1 safe-area-bottom"
		>
			<div className="flex items-center justify-around gap-1 max-w-md mx-auto">
				{items.map((item) => {
					const Icon = item.icon
					const isActive = item.exact
						? location.pathname === item.path
						: location.pathname.startsWith(item.path)

					return (
						<Link
							key={item.path}
							to={item.path}
							className={`relative flex-1 min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 active:scale-95 ${
								isActive
									? 'text-[#FF6B00] font-bold'
									: 'text-slate-500 hover:text-slate-900 font-medium'
							}`}
						>
							<div className="relative flex items-center justify-center">
								<Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
								{Boolean(item.badge && item.badge > 0) && (
									<span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF6B00] px-1 text-[9px] font-black text-white ring-2 ring-white">
										{item.badge && item.badge > 9 ? '9+' : item.badge}
									</span>
								)}
							</div>
							<span className="text-[10px] tracking-tight mt-0.5 leading-tight truncate max-w-[68px]">
								{item.label}
							</span>
							{isActive && (
								<span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#FF6B00]" />
							)}
						</Link>
					)
				})}
			</div>
		</nav>
	)
}
