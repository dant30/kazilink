// frontend/src/shared/layouts/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom'
import {
	Award,
	Bell,
	Briefcase,
	CreditCard,
	FileText,
	Home,
	MessageSquare,
	PlusCircle,
	Settings,
	ShieldCheck,
	Star,
	Users,
	UserCheck,
} from 'lucide-react'

import { useAuthStore } from '../../features/auth/store'
import { localStorageStore } from '../../core/storage'

const workerNavItems = [
	{ path: '/dashboard/worker', label: 'Worker Dashboard', icon: Home },
	{ path: '/jobs', label: 'Find Shifts & Gigs', icon: Briefcase },
	{ path: '/jobs/saved', label: 'Saved Jobs', icon: Briefcase },
	{ path: '/applications', label: 'My Applications', icon: FileText },
	{ path: '/employment-history', label: 'Work Passport / History', icon: Award },
	{ path: '/payments', label: 'Buy Kazi Credits', icon: CreditCard },
	{ path: '/messages', label: 'Messages', icon: MessageSquare },
	{ path: '/notifications', label: 'Notifications', icon: Bell },
	{ path: '/ratings', label: 'Reviews & Ratings', icon: Star },
	{ path: '/support', label: 'Support', icon: Settings },
	{ path: '/profile/worker', label: 'Worker Profile', icon: UserCheck },
]

const employerNavItems = [
	{ path: '/dashboard/employer', label: 'Employer Dashboard', icon: Home },
	{ path: '/jobs', label: 'My Job Postings', icon: Briefcase },
	{ path: '/workers', label: 'Browse Verified Talent', icon: UserCheck },
	{ path: '/applications', label: 'Applicants', icon: FileText },
	{ path: '/establishments', label: 'Establishments', icon: Award },
	{ path: '/messages', label: 'Messages', icon: MessageSquare },
	{ path: '/notifications', label: 'Notifications', icon: Bell },
	{ path: '/payments', label: 'Buy Kazi Credits', icon: CreditCard },
	{ path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
	{ path: '/ratings', label: 'Reviews & Ratings', icon: Star },
	{ path: '/support', label: 'Support', icon: Settings },
	{ path: '/profile/employer', label: 'Employer Profile', icon: UserCheck },
]

const adminNavItems = [
	{ path: '/admin', label: 'Operations Dashboard', icon: ShieldCheck },
	{ path: '/admin/users', label: 'User Directory', icon: Home },
	{ path: '/admin/workers', label: 'Worker Accounts', icon: UserCheck },
	{ path: '/admin/employers', label: 'Employer Accounts', icon: Users },
	{ path: '/admin/jobs', label: 'Job Oversight', icon: Briefcase },
	{ path: '/admin/establishments', label: 'Establishments', icon: Award },
	{ path: '/admin/employment-history', label: 'Verification Queue', icon: Award },
	{ path: '/admin/fraud', label: 'Fraud Alerts', icon: Bell },
	{ path: '/admin/analytics', label: 'Reports & KPIs', icon: CreditCard },
	{ path: '/admin/audit', label: 'Audit Log', icon: FileText },
	{ path: '/admin/applications', label: 'Applications', icon: FileText },
	{ path: '/admin/payments', label: 'Payments', icon: CreditCard },
	{ path: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
	{ path: '/admin/ratings', label: 'Reviews & Ratings', icon: Star },
	{ path: '/admin/messaging', label: 'Messages', icon: MessageSquare },
	{ path: '/admin/support', label: 'Support Queue', icon: Settings },
	{ path: '/admin/profile', label: 'Admin Profile', icon: UserCheck },
]

export interface SidebarProps {
	admin?: boolean
	mobileDrawer?: boolean
	onItemClick?: () => void
}

export function Sidebar({ admin = false, mobileDrawer = false, onItemClick }: SidebarProps) {
	const navigate = useNavigate()
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

	const effectiveAdmin = admin || Boolean(storedUser?.is_staff || storedUser?.is_superuser)
	const items = effectiveAdmin
		? adminNavItems
		: storedUser?.is_employer && !storedUser?.is_worker
			? employerNavItems
			: workerNavItems
	const isEmployer = Boolean(storedUser?.is_employer && !storedUser?.is_worker)

	const sidebarCta = effectiveAdmin
		? {
				label: 'Log out',
				onClick: () => {
					localStorageStore.remove('access_token')
					localStorageStore.remove('refresh_token')
					localStorageStore.remove('user')
					navigate('/login')
				},
			}
		: isEmployer
			? { label: 'Post Shift', onClick: () => navigate('/jobs/new') }
			: { label: 'Find Shifts', onClick: () => navigate('/jobs') }

	const containerClasses = mobileDrawer
		? 'flex w-full bg-[#0A2540] text-slate-100 flex-col p-4 space-y-4'
		: 'hidden md:flex flex-col w-64 shrink-0 bg-[#0A2540] text-slate-100 border-r border-slate-800 p-4 sticky top-[88px] h-[calc(100vh-88px)] overflow-hidden z-30'

	return (
		<aside className={containerClasses} aria-label={effectiveAdmin ? 'Admin navigation' : 'Main navigation'}>
			{!mobileDrawer && (
				<div className="shrink-0 px-2 py-2 mb-4 border-b border-slate-800 pb-3">
					<span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00] block">
						{effectiveAdmin ? 'Operational Control' : isEmployer ? 'Employer Workspace' : 'Worker Workspace'}
					</span>
					<h2 className="text-base font-bold text-white tracking-tight">KaziLink Verified</h2>
				</div>
			)}

			<nav className={`min-h-0 flex-1 space-y-1 overflow-y-auto ${!mobileDrawer ? 'sidebar-nav-scrollbar' : ''}`}>
				<p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
					Navigation
				</p>
				{items.map((item) => {
					const Icon = item.icon
					return (
						<NavLink
							key={item.path}
							to={item.path}
							end={item.path === '/admin' || item.path === '/dashboard/worker' || item.path === '/dashboard/employer'}
							onClick={onItemClick}
							className={({ isActive }) =>
								`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
									isActive
										? 'bg-[#FF6B00] text-white shadow-sm font-bold'
										: 'text-slate-300 hover:bg-[#123860] hover:text-white'
								}`
							}
						>
							<Icon className="w-4 h-4 shrink-0 text-slate-300" />
							<span className="truncate">{item.label}</span>
						</NavLink>
					)
				})}
			</nav>

			{/* Role-specific CTA */}
			<div className="shrink-0 pt-4 border-t border-slate-800 mt-auto">
				<button
					type="button"
					onClick={() => {
						sidebarCta.onClick()
						onItemClick?.()
					}}
					className={`w-full flex items-center justify-center gap-2 ${
						effectiveAdmin
							? 'bg-slate-700 hover:bg-slate-600 text-white'
							: 'bg-[#FF6B00] hover:bg-[#E55F00] text-white'
					} font-bold py-2.5 px-4 rounded-xl text-sm transition shadow-sm`}
				>
					{effectiveAdmin ? <Settings className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
					<span>{sidebarCta.label}</span>
				</button>
			</div>
		</aside>
	)
}
