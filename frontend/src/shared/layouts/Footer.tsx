// frontend/src/shared/layouts/Footer.tsx
import { ShieldCheck, Phone, Mail, MapPin, Heart, CreditCard, Award } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
	return (
		<footer className="border-t border-slate-800/80 bg-gradient-to-b from-[#0A2540] via-[#07192C] to-[#040E1A] pb-24 pt-12 text-slate-300 sm:pb-10 sm:pt-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
					{/* Column 1: Brand & Mission */}
					<div className="space-y-4 sm:col-span-2 lg:col-span-2">
						<Link to="/" className="inline-flex items-center gap-2"><img src="/icons/logo-192.png" alt="KaziLink" className="h-9 w-9 rounded-xl object-cover shadow-xs" /><span className="text-2xl font-black tracking-tight text-white">Kazi<span className="text-[#FF6B00]">Link</span></span></Link>
						<p className="max-w-sm text-xs leading-relaxed text-slate-400 sm:text-sm">
							Kenya's premier on-demand hospitality and casual worker network, connecting verified bartenders, waitstaff, baristas, chefs, and cleaners with top establishments.
						</p>
						<div className="flex flex-wrap gap-2 pt-1"><div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
							<ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
							<span className="text-[11px]">100% Kenyan Reference Checked</span></div><div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"><CreditCard className="w-4 h-4" /><span className="text-[11px]">M-Pesa Escrow Protected</span></div></div>
					</div>

					{/* Column 2: Quick Links */}
					<div>
						<h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-white">For Workers</h4>
						<ul className="space-y-2 text-xs">
							<li>
								<Link to="/jobs" className="text-slate-300 hover:text-[#FF6B00] transition">
									Browse Casual Shifts
								</Link>
							</li>
							<li>
								<Link to="/dashboard" className="text-slate-300 hover:text-[#FF6B00] transition">
									My Applications
								</Link>
							</li>
							<li>
								<Link to="/profile" className="text-slate-300 hover:text-[#FF6B00] transition">
									Verified Work History
								</Link>
							</li>
							<li>
								<Link to="/messages" className="text-slate-300 hover:text-[#FF6B00] transition">
									Kazi Credits & Wallet
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 3: Employers */}
					<div>
						<h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-white">For Employers</h4>
						<ul className="space-y-2 text-xs">
							<li><Link to="/jobs/new" className="text-slate-300 hover:text-[#FF6B00]">Post a Shift Opening</Link></li><li><Link to="/workers" className="text-slate-300 hover:text-[#FF6B00]">Browse Talent Pool</Link></li><li><Link to="/establishments" className="text-slate-300 hover:text-[#FF6B00]">Hospitality Venues</Link></li><li><Link to="/payments" className="text-slate-300 hover:text-[#FF6B00]">Employer Billing & Top-Up</Link></li>
						</ul>
					</div>

					{/* Column 4: Support */}
					<div className="space-y-3">
						<h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-white">Support Desk</h4>
						<div className="flex items-start gap-2.5 text-xs text-slate-400">
							<MapPin className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
							<span>Nationwide across Kenya</span>
						</div>
						<div className="flex items-center gap-2.5 text-xs text-slate-400">
							<Phone className="w-4 h-4 text-[#FF6B00] shrink-0" />
							<a href="tel:+254728102107" className="hover:text-white transition font-mono">
								+254 728 102 107
							</a>
						</div>
						<Link to="/support" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/15"><Award className="h-3.5 w-3.5 text-[#FF6B00]" />Open Help Ticket</Link>
						<div className="flex items-center gap-2.5 text-xs text-slate-400">
							<Mail className="w-4 h-4 text-[#FF6B00] shrink-0" />
							<a href="mailto:support@kazilink.co.ke" className="hover:text-white transition font-mono">
								support@kazilink.co.ke
							</a>
						</div>
					</div>
				</div>

				{/* Bottom Copyright */}
				<div className="flex flex-col items-center justify-between gap-3 border-t border-slate-800/90 pt-6 text-xs text-slate-400 sm:flex-row">
					<p>© {new Date().getFullYear()} KaziLink Kenya Ltd. All rights reserved.</p>
					<div className="flex items-center gap-1">
						<span>Built with</span>
						<Heart className="w-3.5 h-3.5 text-[#FF6B00] fill-[#FF6B00]" />
						<span>for Kenya</span>
					</div>
				</div>
			</div>
		</footer>
	)
}
