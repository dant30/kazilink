import { Link } from 'react-router-dom'

import { Button } from '../../../shared/components/ui/Button'
import { AuthPanel } from '../components'

export function ForgotPasswordPage() {
  return (
    <AuthPanel
      eyebrow="Account access"
      title="Reset your password"
      subtitle="We’ll help you get back into your KaziLink account securely."
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Password reset delivery will be available when the recovery endpoint is enabled.
        </div>

        <Link to="/login" className="block">
          <Button variant="navy" size="lg" className="w-full">
            Return to sign in
          </Button>
        </Link>
      </div>
    </AuthPanel>
  )
}
