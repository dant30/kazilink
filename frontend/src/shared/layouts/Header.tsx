// frontend/src/shared/layouts/Header.tsx
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
	Bell,
	Briefcase,
	FileText,
	Home,
	LayoutDashboard,
	LogOut,
	Menu,
	MessageSquare,
	ShieldCheck,
	UserCircle,
	Users,
	X,
} from 'lucide-react'

import { authStore, useAuthStore } from '../../features/auth/store'
import { Sidebar } from './Sidebar'
import { useNotifications } from '../../features/notifications/hooks/useNotifications'
import { ACCESS_TOKEN_KEY } from '../../core/api'
import { localStorageStore } from '../../core/storage'
import { endpoints } from '../../core/api/endpoints'

export function Header() {
	const navigate = useNavigate()
	const { user } = useAuthStore()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [notifDropdownOpen, setNotifDropdownOpen] = useState(false)
	const [userMenuOpen, setUserMenuOpen] = useState(false)
	const [creditBalance, setCreditBalance] = useState<number | null>(null)
	const [profileImage, setProfileImage] = useState<string | null>(null)
	const notificationRef = useRef<HTMLDivElement>(null)
	const userMenuRef = useRef<HTMLDivElement>(null)

	function signOut() {
		setUserMenuOpen(false)
		setMobileMenuOpen(false)
		authStore.signOut()
		navigate('/login')
	}

	let storedUser: {
		is_staff?: boolean
		is_superuser?: boolean
		is_employer?: boolean
		is_worker?: boolean
		full_name?: string
		email?: string | null
		phone?: string | null
		avatar?: string | null
	} | null = user ?? null

	if (!storedUser) {
		try {
			storedUser = localStorageStore.get<typeof storedUser>('user')
		} catch {
			storedUser = null
		}
	}

	const signedIn = localStorageStore.has(ACCESS_TOKEN_KEY)
	useEffect(() => {
		if (!signedIn) {
			setCreditBalance(null)
			return
		}
		endpoints.credits.wallet().then((response) => setCreditBalance(response.wallet.balance)).catch(() => setCreditBalance(null))
	}, [signedIn])
	useEffect(() => {
		if (!signedIn) {
			setProfileImage(null)
			return
		}
		setProfileImage(storedUser?.avatar || null)
		if (storedUser?.is_worker) {
			endpoints.workers.me().then((profile) => setProfileImage(profile.avatar || profile.user.avatar || null)).catch(() => undefined)
		} else if (storedUser?.is_employer) {
			endpoints.auth.employerProfile().then((profile) => setProfileImage(profile.avatar || null)).catch(() => undefined)
		}
	}, [signedIn, user?.id, user?.is_worker, user?.is_employer])
	useEffect(() => {
		if (!notifDropdownOpen && !userMenuOpen) return
		const closeOnOutsideClick = (event: MouseEvent) => {
			const target = event.target as Node
			if (notifDropdownOpen && !notificationRef.current?.contains(target)) setNotifDropdownOpen(false)
			if (userMenuOpen && !userMenuRef.current?.contains(target)) setUserMenuOpen(false)
		}
		document.addEventListener('mousedown', closeOnOutsideClick)
		return () => document.removeEventListener('mousedown', closeOnOutsideClick)
	}, [notifDropdownOpen, userMenuOpen])
	const isAdmin = Boolean(storedUser?.is_staff || storedUser?.is_superuser)
	const isWorker = Boolean(storedUser?.is_worker)
	const isEmployer = Boolean(storedUser?.is_employer && !storedUser?.is_worker)
	const primaryMarketPath = isWorker ? '/jobs' : isEmployer ? '/workers' : '/jobs'
	const primaryMarketLabel = isWorker ? 'Find Shifts' : isEmployer ? 'Browse Talent' : 'Find Shifts'
	const dashboardPath = isAdmin ? '/admin' : isEmployer ? '/dashboard/employer' : '/dashboard/worker'
	const profilePath = isAdmin ? '/admin/profile' : isWorker ? '/profile/worker' : isEmployer ? '/profile/employer' : '/profile'
	const settingsPath = isAdmin ? '/admin/profile' : isWorker ? '/profile/worker/settings' : isEmployer ? '/profile/employer/settings' : '/profile'
	const profileMenuLabel = isAdmin ? 'Admin profile' : isWorker ? 'Worker profile' : isEmployer ? 'Employer profile' : 'Profile'
	const messagePath = isAdmin ? '/admin' : '/messages'

	const fullName = storedUser?.full_name?.trim() || 'User'
	const initials =
		fullName
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? '')
			.join('') || 'U'
	const { notifications, markRead } = useNotifications({ enabled: signedIn })
	const unreadNotifications = notifications.filter((notification) => !notification.is_read)

	return (
		<header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-[0_4px_16px_-6px_rgba(10,37,64,0.22)]">
			{/* Top Banner */}
			<div className="bg-[#0A2540] text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#FF6B00] text-white font-bold text-[10px]">
						🇰🇪 KENYA LIVE
					</span>
					<span className="text-slate-300 text-[11px] hidden sm:inline">
						Verified Hospitality & Casual Staff Network • Real-Time Attendance & Payouts
					</span>
				</div>
				<div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-[11px] text-slate-300 sm:gap-4">
					{signedIn ? <span className="font-semibold text-white">Kazi Credits: {creditBalance ?? '...'}</span> : <span>Trusted hiring and work opportunities</span>}
					<span className="text-slate-500">•</span>
					<span className="hidden truncate sm:inline">{signedIn ? 'Use credits for premium platform actions' : 'Built for Kenya\'s workforce'}</span>
				</div>
			</div>

			{/* Main Navbar */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<div className="flex items-center gap-6">
						<Link to="/" className="flex items-center gap-2">
								<img src="/icons/logo-192.png" alt="KaziLink" className="h-8 w-8 rounded-xl object-cover" />
							<span className="text-2xl font-black text-[#0A2540] tracking-tight hover:text-[#FF6B00] transition">
								Kazi<span className="text-[#FF6B00]">Link</span>
							</span>
						</Link>

						{/* Desktop Public Navigation */}
						<nav className="hidden md:flex items-center gap-1">
							{!isAdmin && (
								<>
									{signedIn ? (
										<Link
											to={primaryMarketPath}
											className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
										>
											{primaryMarketLabel}
										</Link>
									) : (
										<>
											<Link
												to="/jobs"
												className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
											>
												Find Shifts
											</Link>
											<Link
												to="/workers"
												className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
											>
												Browse Talent
											</Link>
										</>
									)}
								</>
							)}
							{signedIn && (
								<Link
									to={dashboardPath}
									className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#FF6B00] bg-orange-50 hover:bg-orange-100 transition"
								>
									{isAdmin ? 'Admin Desk' : isEmployer ? 'Employer Hub' : 'Worker Hub'}
								</Link>
							)}
						</nav>
					</div>

					{/* Right Actions */}
					<div className="flex items-center gap-2 sm:gap-3">
						{signedIn ? (
							<>
								{/* Messages */}
								<Link
									to={messagePath}
									className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
									title="Messages"
								>
									<MessageSquare className="w-5 h-5" />
								</Link>

								{/* Notifications */}
								<div ref={notificationRef} className="relative">
									<button
										type="button"
										onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
										className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition relative"
										title="Notifications"
									>
										<Bell className="w-5 h-5" />
										{unreadNotifications.length > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF6B00] px-1 text-[9px] font-bold text-white">{unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}</span>}
									</button>
									{notifDropdownOpen && (
										<div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
											<div className="px-4 py-2.5 bg-slate-50 text-xs font-bold text-slate-900 uppercase">
												Notifications
											</div>
											{unreadNotifications.length ? unreadNotifications.slice(0, 3).map((notification) => <button key={notification.id} type="button" onClick={() => markRead(notification.id).catch(() => undefined)} className="block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50"><p className="truncate text-xs font-bold text-slate-800">{notification.title}</p><p className="mt-1 line-clamp-2 text-xs text-slate-500">{notification.message}</p></button>) : <div className="p-4 text-center text-xs text-slate-400">No new notifications</div>}
											<Link to="/notifications" onClick={() => setNotifDropdownOpen(false)} className="block px-4 py-3 text-center text-xs font-bold text-[#FF6B00] hover:bg-orange-50">View all notifications</Link>
										</div>
									)}
								</div>

								{/* User avatar menu */}
								<div ref={userMenuRef} className="relative">
									<button
										type="button"
										onClick={() => setUserMenuOpen((value) => !value)}
										className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 text-left transition hover:bg-slate-100"
										aria-label="Open user menu"
									>
										{profileImage ? (
											<img
												src={profileImage}
												alt={fullName}
												className="h-8 w-8 rounded-full object-cover"
											/>
										) : (
											<span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B00] text-xs font-bold text-white shadow-xs">
												{initials}
											</span>
										)}
									</button>

									{userMenuOpen && (
										<div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl z-50">
											<div className="border-b border-slate-100 px-4 py-3 bg-slate-50/50">
												<p className="text-sm font-bold text-slate-900 truncate">{fullName}</p>
												<p className="text-xs text-slate-500 truncate">
													{user?.email || user?.phone || 'KaziLink member'}
												</p>
											</div>
											<div className="py-1">
												<Link
													to={dashboardPath}
													onClick={() => setUserMenuOpen(false)}
													className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
												>
													<LayoutDashboard className="h-4 w-4 text-slate-400" />
													Dashboard
												</Link>
												<Link
													to={profilePath}
													onClick={() => setUserMenuOpen(false)}
													className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
												>
													<UserCircle className="h-4 w-4 text-slate-400" />
													{profileMenuLabel}
												</Link>
												<Link
													to={settingsPath}
													onClick={() => setUserMenuOpen(false)}
													className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
												>
													<ShieldCheck className="h-4 w-4 text-slate-400" />
													Account settings
												</Link>
												<Link
													to={messagePath}
													onClick={() => setUserMenuOpen(false)}
													className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
												>
													<MessageSquare className="h-4 w-4 text-slate-400" />
													Messages
												</Link>
												<button
													type="button"
													onClick={signOut}
													className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50"
												>
													<LogOut className="h-4 w-4" />
													Sign out
												</button>
											</div>
										</div>
									)}
								</div>
							</>
						) : (
							<div className="hidden sm:flex items-center gap-2">
								<Link
									to="/login"
									className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
								>
									Sign In
								</Link>
								<Link
									to="/register"
									className="px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#E55F00] text-white text-xs font-bold transition shadow-xs"
								>
									Create Account
								</Link>
							</div>
						)}

						{/* Mobile Menu Toggle Button */}
						<button
							type="button"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition md:hidden"
							aria-label="Toggle navigation drawer"
						>
							{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Drawer (Slide-out on small devices) */}
			{mobileMenuOpen && (
				<div
					className="md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end"
					onClick={() => setMobileMenuOpen(false)}
				>
					<div
						className="h-full w-[85%] max-w-sm overflow-y-auto bg-[#0A2540] text-slate-100 shadow-2xl flex flex-col"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Drawer Header */}
						<div className="flex items-center justify-between border-b border-slate-800 p-4">
							{signedIn ? (
								<div className="flex items-center gap-3">
									{profileImage ? (
										<img
											src={profileImage}
											alt={fullName}
											className="h-10 w-10 rounded-full object-cover"
										/>
									) : (
										<span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B00] text-sm font-bold text-white shadow-xs">
											{initials}
										</span>
									)}
									<div>
										<p className="text-sm font-bold text-white">{fullName}</p>
										<p className="text-[11px] text-slate-400">
											{isAdmin ? 'Administrator' : isEmployer ? 'Employer' : 'Hospitality Talent'}
										</p>
									</div>
								</div>
							) : (
								<div className="flex items-center gap-2">
									<img src="/icons/logo-192.png" alt="KaziLink" className="h-8 w-8 rounded-xl object-cover" />
									<span className="text-lg font-black text-white">KaziLink Kenya</span>
								</div>
							)}
							<button
								type="button"
								onClick={() => setMobileMenuOpen(false)}
								className="rounded-xl p-2 text-slate-300 hover:bg-slate-800"
								aria-label="Close menu"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{/* Drawer Content */}
						{signedIn ? (
							<div className="flex-1 overflow-y-auto">
								<Sidebar
									admin={isAdmin}
									mobileDrawer
									onItemClick={() => setMobileMenuOpen(false)}
								/>
								<div className="px-4 pb-6 pt-2 border-t border-slate-800">
									<button
										type="button"
										onClick={signOut}
										className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-rose-400 transition"
									>
										<LogOut className="h-4 w-4" /> Sign Out
									</button>
								</div>
							</div>
						) : (
							<div className="flex-1 flex flex-col justify-between p-5 space-y-6">
								<div className="space-y-1">
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
										Public Navigation
									</p>
									<Link
										to="/"
										onClick={() => setMobileMenuOpen(false)}
										className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
									>
										<Home className="h-4 w-4 text-[#FF6B00]" /> Home
									</Link>
									<Link
										to="/jobs"
										onClick={() => setMobileMenuOpen(false)}
										className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
									>
										<Briefcase className="h-4 w-4 text-[#FF6B00]" /> Find Shifts & Gigs
									</Link>
									<Link
										to="/workers"
										onClick={() => setMobileMenuOpen(false)}
										className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
									>
										<Users className="h-4 w-4 text-[#FF6B00]" /> Browse Verified Talent
									</Link>
									<Link
										to="/terms"
										onClick={() => setMobileMenuOpen(false)}
										className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
									>
										<FileText className="h-4 w-4 text-slate-400" /> Terms of Service
									</Link>
								</div>

								<div className="space-y-3 pt-6 border-t border-slate-800">
									<Link
										to="/login"
										onClick={() => setMobileMenuOpen(false)}
										className="w-full flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-xs font-bold text-white transition"
									>
										Sign In to Account
									</Link>
									<Link
										to="/register"
										onClick={() => setMobileMenuOpen(false)}
										className="w-full flex items-center justify-center rounded-xl bg-[#FF6B00] hover:bg-[#E55F00] py-3 text-xs font-bold text-white transition shadow-sm"
									>
										Create Free Account
									</Link>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</header>
	)
}
