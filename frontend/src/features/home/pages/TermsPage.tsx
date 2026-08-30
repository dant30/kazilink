import { useState } from 'react'
import { AlertCircle, ArrowLeft, ChevronDown, ChevronUp, HelpCircle, Phone, Printer, Scale, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { Badge } from '../../../shared/components/ui/Badge'
import { Button } from '../../../shared/components/ui/Button'

const sections = [
  ['overview', '1. Platform Overview & Scope'], ['employment', '2. Employment Types'], ['privacy', '3. Data Privacy & ID Verification'],
  ['references', '4. Verified Work History'], ['payments', '5. M-Pesa Fees & Payment Terms'], ['safety', '6. Workplace Safety & Remuneration'],
  ['reliability', '7. Anti-Ghosting & Reliability'], ['disputes', '8. Dispute Resolution & Kenyan Law'],
]

const faqs = [
  ['Can employers hire workers permanently?', 'Yes. Employers may post permanent full-time and part-time positions with written contracts, agreed salaries, probation terms, and applicable statutory benefits.'],
  ['Why is there a KSh 100 history unlock fee?', 'The fee supports manual supervisor verification, National ID checks, and privacy controls that prevent spam and candidate scraping.'],
  ['Is KaziLink compliant with the Kenya Data Protection Act 2019?', 'Workers consent to reference checks and controlled sharing with verified employers. Full National ID numbers and home addresses remain private.'],
  ['What happens after a confirmed shift no-show?', 'Reliability scores are reduced after confirmed no-shows. Repeated violations may lead to temporary suspension or permanent removal from the marketplace.'],
]

export function TermsPage() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const goTo = (id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3"><button type="button" onClick={() => navigate('/')} className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"><ArrowLeft className="h-4 w-4" /> Back to Marketplace</button><Badge variant="orange" size="md">Legal Document</Badge></div>
          <div className="flex items-center gap-2"><button type="button" onClick={() => window.print()} className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"><Printer className="h-3.5 w-3.5" /> Print / Save PDF</button><Button variant="navy" size="sm" onClick={() => navigate('/register')}>Accept & Continue</Button></div>
        </div>

        <header className="relative mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#0A2540] p-8 text-white shadow-xl sm:p-10"><div className="relative z-10 max-w-3xl space-y-3"><div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold"><Scale className="h-3.5 w-3.5 text-[#FF6B00]" /> Kenya Legal & Operational Framework</div><h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl">Terms & Conditions of Service</h1><p className="text-sm leading-relaxed text-slate-300">Governing permanent placements, casual shifts, verified employment history, and M-Pesa marketplace services across Kenya.</p><div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400"><span>Last revised: August 2026</span><span>All 47 counties</span><span>Version 2.4-KE</span></div></div><ShieldCheck className="absolute -bottom-10 -right-8 h-64 w-64 text-white opacity-10" /></header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-4"><div className="sticky top-20 space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="px-2 text-xs font-bold uppercase tracking-wider text-slate-400">Quick Navigation</h2><nav className="space-y-1 text-xs font-semibold">{sections.map(([id, title]) => <button type="button" key={id} onClick={() => goTo(id)} className={`w-full rounded-xl px-3 py-2.5 text-left transition ${activeSection === id ? 'border-l-4 border-[#FF6B00] bg-orange-50 font-bold text-[#FF6B00]' : 'text-slate-600 hover:bg-slate-50'}`}>{title}</button>)}</nav><div className="mt-4 border-t border-slate-100 px-2 pt-4 text-xs text-slate-500"><div className="flex items-center gap-1.5 font-bold text-slate-700"><Phone className="h-3.5 w-3.5 text-[#FF6B00]" /> Legal Helpline</div><p className="mt-2 leading-snug">Questions about contracts or privacy? Call +254 728 102 107.</p></div></div></aside>
          <main className="space-y-6 text-sm leading-relaxed text-slate-700 lg:col-span-8">
            {sections.slice(0, 8).map(([id, title], index) => <section id={id} key={id} className="scroll-mt-24 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-2"><span className={`flex h-7 w-7 items-center justify-center rounded-lg font-bold text-white ${index % 3 === 1 ? 'bg-[#FF6B00]' : 'bg-[#0A2540]'}`}>{index + 1}</span><h2 className="text-lg font-black text-slate-900">{title}</h2></div><p>{index === 0 && 'KaziLink operates a two-sided digital labor network for hospitality and casual work. Registering, posting, or applying creates an agreement governed by the laws of Kenya.'}{index === 1 && 'Employers may offer permanent or casual engagements. Each party must agree the role, hours, compensation, and applicable employment obligations before work begins.'}{index === 2 && 'Workers consent to proportionate verification. Public profiles do not reveal full National ID numbers, private addresses, or protected contact details.'}{index === 3 && 'KaziLink verifies stated work history through direct supervisor audits. Fabricated references or experience may result in immediate account suspension.'}{index === 4 && 'Employers may pay KSh 100 for a single verified history unlock or use prepaid credits. Unlocks are non-refundable once valid records are rendered.'}{index === 5 && 'All parties must provide a safe, respectful workplace. Harassment, exploitation, and withheld wages may result in investigation and removal.'}{index === 6 && 'Confirmed no-shows and late cancellations affect reliability scores. Repeated violations may lead to temporary or permanent suspension.'}{index === 7 && 'Disputes should first go through KaziLink conciliation. Unresolved matters are governed by Kenyan law and may proceed through the courts of Kenya.'}</p>{index === 2 && <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs"><strong>Data minimization:</strong> identity and referee information is shared only for legitimate, authenticated marketplace purposes.</div>}{index === 3 && <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950"><AlertCircle className="h-4 w-4 shrink-0 text-amber-700" /><span>Submitting fabricated references is prohibited and may lead to lifetime blacklisting.</span></div>}</section>)}
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-[#FF6B00]" /><h2 className="text-base font-black text-slate-900">Frequently Asked Questions</h2></div>{faqs.map(([question, answer], index) => <div key={question} className="overflow-hidden rounded-xl border border-slate-200"><button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-3 bg-slate-50 p-4 text-left text-xs font-bold text-slate-900 hover:bg-slate-100"><span>{question}</span>{openFaq === index ? <ChevronUp className="h-4 w-4 text-[#FF6B00]" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}</button>{openFaq === index && <p className="border-t border-slate-200 p-4 text-xs text-slate-600">{answer}</p>}</div>)}</section>
            <section className="space-y-4 rounded-2xl bg-slate-900 p-6 text-center text-white"><h2 className="font-bold text-white">Ready to access Kenya's trusted hospitality network?</h2><p className="mx-auto max-w-xl text-xs text-slate-300">By continuing, you acknowledge these marketplace standards and applicable Kenyan regulations.</p><div className="flex flex-wrap justify-center gap-3"><Button variant="primary" size="md" onClick={() => navigate('/register')}>Create an account</Button><Button variant="secondary" size="md" onClick={() => navigate('/jobs')}>Find shifts and jobs</Button></div></section>
          </main>
        </div>
      </div>
    </div>
  )
}
