//frontend/src/features/auth/components/AuthPanel.tsx
import type { ReactNode } from 'react'

export function AuthPanel({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="auth-panel">
      <div className="auth-panel__card">
        <aside className="auth-panel__aside">
          <div className="auth-brand">
            <span className="auth-brand__badge">🇰🇪</span>
            <span className="auth-brand__text">KaziLink</span>
          </div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>
            Verified hospitality jobs, trusted workers, and safer employer hiring across Kenya.
          </p>
        </aside>

        <div className="auth-panel__content">{children}</div>
      </div>
    </section>
  )
}
