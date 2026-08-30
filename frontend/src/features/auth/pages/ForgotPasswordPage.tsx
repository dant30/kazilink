// frontend/src/features/auth/pages/ForgotPasswordPage.tsx
import { Link } from 'react-router-dom'

import { AuthPanel } from '../components'

export function ForgotPasswordPage() {
  return <AuthPanel eyebrow="Account access" title="Reset your password"><div className="auth-form"><p className="feedback">Password reset delivery will be available when the recovery endpoint is enabled.</p><Link className="button button-primary" to="/login">Return to sign in</Link></div></AuthPanel>
}
