// frontend/src/shared/layouts/Footer.tsx
import { ShieldCheck, Phone, Mail, MapPin, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
	return (
		<footer className="bg-[#0A2540] text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
					{/* Column 1: Brand & Mission */}
					<div className="space-y-4">
						<h3 className="text-xl font-bold text-white">KaziLink</h3>
						<p className="text-xs text-slate-400 leading-relaxed">
							Kenya's premier verified hospitality and casual worker marketplace. Linking bars, lounges, hotels, and event organizers with trusted talent.
						</p>
						<div className="flex items-center gap-2 text-xs text-slate-400">
							<ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
							<span>100% Kenyan Verification</span>
						</div>
					</div>

					{/* Column 2: Quick Links */}
					<div>
						<h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Explore</h4>
						<ul className="space-y-2 text-xs">
							<li>
								<Link to="/jobs" className="text-slate-300 hover:text-[#FF6B00] transition">
									Find Jobs
								</Link>
							</li>
							<li>
								<Link to="/dashboard" className="text-slate-300 hover:text-[#FF6B00] transition">
									My Dashboard
								</Link>
							</li>
							<li>
								<Link to="/profile" className="text-slate-300 hover:text-[#FF6B00] transition">
									My Profile
								</Link>
							</li>
							<li>
								<Link to="/messages" className="text-slate-300 hover:text-[#FF6B00] transition">
									Messages
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 3: Support & Legal */}
					<div>
						<h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Support</h4>
						<ul className="space-y-2 text-xs">
							<li>
								<Link to="/support" className="text-slate-300 hover:text-[#FF6B00] transition flex items-center gap-1">
									<ShieldCheck className="w-3.5 h-3.5 text-[#FF6B00]" />
									<span>Help Center</span>
								</Link>
							</li>
							<li className="text-slate-400">Terms of Service</li>
							<li className="text-slate-400">Privacy Policy</li>
							<li className="text-slate-400">Kenya Data Protection Act 2019</li>
						</ul>
					</div>

					{/* Column 4: Contact */}
					<div className="space-y-3">
						<h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact Us</h4>
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
						<div className="flex items-center gap-2.5 text-xs text-slate-400">
							<Mail className="w-4 h-4 text-[#FF6B00] shrink-0" />
							<a href="mailto:support@kazilink.co.ke" className="hover:text-white transition font-mono">
								support@kazilink.co.ke
							</a>
						</div>
					</div>
				</div>

				{/* Bottom Copyright */}
				<div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
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
