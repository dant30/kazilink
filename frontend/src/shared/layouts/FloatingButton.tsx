// frontend/src/shared/layouts/FloatingButton.tsx
import React, { useState } from 'react'
import {
  Headphones,
  Phone,
  Mail,
  MessageCircle,
  X,
  Check,
  Copy,
  Clock,
  ShieldCheck,
} from 'lucide-react'

export const FloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [copiedType, setCopiedType] = useState<string | null>(null)

  const supportPhone = '+254728102107'
  const supportPhoneDisplay = '+254 728 102 107'
  const supportEmail = 'munene@mambonami.com'
  const whatsappUrl = `https://wa.me/254728102107?text=${encodeURIComponent('Hello KaziLink Support Team, I need assistance with the platform.')}`

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedType(type)
    setTimeout(() => setCopiedType(null), 2000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Support Card Modal */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in divide-y divide-slate-100">
          {/* Header */}
          <div className="bg-[#0A2540] text-white p-5 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shadow-md">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-white">KaziLink Help & Support</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-impulse"></span>
                  </div>
                  <p className="text-[11px] text-slate-300">Live Kenya Support Team</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
                aria-label="Close support modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3.5 bg-white/10 backdrop-blur-xs rounded-xl px-3 py-1.5 flex items-center gap-2 text-[11px] text-slate-200">
              <Clock className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
              <span>Mon – Sat: 7:00 AM – 9:00 PM • Fast Response</span>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="p-4 space-y-2.5 bg-slate-50/50">
            {/* 1. WhatsApp Action */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-2xl transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 block">
                    Chat on WhatsApp
                  </span>
                  <span className="text-[11px] text-slate-500">{supportPhoneDisplay}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#25D366] text-white px-2 py-1 rounded-lg shrink-0">
                Instant
              </span>
            </a>

            {/* 2. Direct Phone Call Action */}
            <div className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition">
              <a
                href={`tel:${supportPhone}`}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0A2540] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Direct Phone Call</span>
                  <span className="text-[11px] text-[#0A2540] font-semibold">{supportPhoneDisplay}</span>
                </div>
              </a>
              <button
                onClick={() => copyToClipboard(supportPhoneDisplay, 'phone')}
                title="Copy phone number"
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition text-xs font-medium"
              >
                {copiedType === 'phone' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* 3. Email Support Action */}
            <div className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition">
              <a
                href={`mailto:${supportEmail}?subject=KaziLink%20Support%20Inquiry`}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Email Official Helpdesk</span>
                  <span className="text-[11px] text-slate-600 font-mono">{supportEmail}</span>
                </div>
              </a>
              <button
                onClick={() => copyToClipboard(supportEmail, 'email')}
                title="Copy email address"
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition text-xs font-medium"
              >
                {copiedType === 'email' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="px-4 py-2.5 bg-slate-100 text-center text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Nationwide Hospitality Support • KaziLink Kenya</span>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-4 py-3.5 rounded-full shadow-2xl transition-all duration-300 font-bold text-sm select-none border-2 border-white/30 ${
          isOpen
            ? 'bg-[#0A2540] text-white rotate-0'
            : 'bg-[#FF6B00] hover:bg-[#E55F00] text-white hover:scale-105 animate-float hover:animate-none shadow-[0_8px_25px_rgba(255,107,0,0.45)]'
        }`}
        id="floating-support-btn"
        aria-label="Toggle contact support"
      >
        <div className="relative">
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Headphones className="w-5 h-5" />
          )}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-impulse ring-2 ring-white"></span>
          )}
        </div>
        <span className="hidden font-black tracking-wide text-xs sm:inline">
          {isOpen ? 'Close Support' : 'Support & Contacts'}
        </span>
      </button>
    </div>
  )
}

