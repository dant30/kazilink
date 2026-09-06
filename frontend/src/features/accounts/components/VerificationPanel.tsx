import { useEffect, useState, type ReactNode } from 'react'
import { CheckCircle2, FileCheck2, ShieldAlert, Upload } from 'lucide-react'
import { endpoints } from '../../../core/api'
import { toast } from '../../../shared/components/feedback'
import type { VerificationDocument } from '../../auth/types'

export function VerificationPanel({ email, phoneVerified, idVerified }: { email?: string | null; phoneVerified: boolean; idVerified: boolean }) {
  const [documents, setDocuments] = useState<VerificationDocument[]>([])
  const [uploading, setUploading] = useState<VerificationDocument['document_type'] | null>(null)
  const load = () => endpoints.auth.verificationDocuments().then(setDocuments).catch(() => undefined)
  useEffect(() => { void load() }, [])
  const latest = (type: VerificationDocument['document_type']) => documents.find((document) => document.document_type === type)
  const upload = async (type: VerificationDocument['document_type'], file?: File) => {
    if (!file) return
    setUploading(type)
    const data = new FormData()
    data.append('document_type', type)
    data.append('document', file)
    try { await endpoints.auth.uploadVerificationDocument(data); await load(); toast.success('Document submitted', 'Your document is pending admin review.') } catch (error) { toast.error('Upload failed', error instanceof Error ? error.message : 'Unable to upload document.') } finally { setUploading(null) }
  }
  const status = (document?: VerificationDocument) => document?.status === 'verified' ? <span className="text-emerald-700">Verified</span> : document?.status === 'rejected' ? <span className="text-rose-700">Rejected</span> : document ? <span className="text-amber-700">Pending review</span> : <span className="text-slate-500">Not submitted</span>
  const row = (label: string, value: ReactNode, type?: VerificationDocument['document_type']) => <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0"><div className="flex items-center gap-2 text-sm text-slate-700"><FileCheck2 className="h-4 w-4 text-[#FF6B00]" />{label}</div><div className="flex items-center gap-2 text-xs font-bold">{value}{type && <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-slate-700 hover:bg-slate-50"><Upload className="h-3.5 w-3.5" />{uploading === type ? 'Uploading...' : latest(type) ? 'Replace' : 'Upload'}<input type="file" accept="image/*,.pdf" className="sr-only" disabled={uploading !== null} onChange={(event) => { void upload(type, event.target.files?.[0]); event.currentTarget.value = '' }} /></label>}</div></div>
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start gap-3"><ShieldAlert className="mt-0.5 h-5 w-5 text-[#FF6B00]" /><div><h2 className="text-lg font-black text-slate-900">Account verification</h2><p className="mt-1 text-sm text-slate-500">Your contact and identity verification status is always visible here.</p></div></div><div className="mt-4 divide-y divide-slate-100">{row('Email address', email ? <span className="text-emerald-700">Provided: {email}</span> : <span className="text-amber-700">Add an email address</span>)}{row('Phone number', phoneVerified ? <span className="inline-flex items-center gap-1 text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Verified by OTP</span> : <span className="text-amber-700">Not verified</span>)}{row('National ID', idVerified ? <span className="text-emerald-700">Verified</span> : status(latest('national_id')), 'national_id')}{row('Certificate of Good Conduct', status(latest('good_conduct')), 'good_conduct')}</div></section>
}
