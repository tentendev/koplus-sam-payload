import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main className="auth-shell">
      <aside className="auth-brand-panel">
        <div className="auth-brand-topline">
          <span className="auth-brand-mark">KOPLUS</span>
          <span className="auth-brand-system">SAM CMS</span>
        </div>

        <div aria-hidden="true" className="auth-booth-graphic">
          <span className="auth-booth-door" />
          <span className="auth-booth-handle" />
          <span className="auth-booth-floor" />
        </div>

        <div className="auth-brand-copy">
          <p className="auth-eyebrow">CONTENT OPERATIONS</p>
          <h1>Make every detail feel considered.</h1>
          <p className="auth-brand-description">
            Manage SAM products, finishes, palettes, and enquiries from one focused workspace.
          </p>
        </div>

        <div className="auth-brand-footer">
          <span>DESIGNED FOR KOPLUS</span>
          <span>SECURE ADMIN</span>
        </div>
      </aside>

      <section className="auth-form-panel">
        <div className="auth-mobile-brand">
          <span className="auth-brand-mark">KOPLUS</span>
          <span className="auth-brand-system">SAM CMS</span>
        </div>

        <div className="auth-form-wrap">
          <div className="auth-form-intro">
            <p className="auth-eyebrow auth-eyebrow-dark">ADMIN WORKSPACE</p>
            <h2>Welcome back.</h2>
            <p>Sign in with your approved account to continue.</p>
          </div>

          <SignIn
            appearance={{
              elements: {
                card: {
                  background: 'transparent',
                  border: '0',
                  boxShadow: 'none',
                  padding: '0',
                },
                cardBox: {
                  boxShadow: 'none',
                  maxWidth: '440px',
                  width: '100%',
                },
                dividerLine: {
                  backgroundColor: '#d8dce4',
                },
                dividerText: {
                  color: '#7b8390',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                },
                footer: {
                  background: 'transparent',
                  padding: '1.25rem 0 0',
                },
                footerActionLink: {
                  color: '#20242b',
                  fontWeight: 700,
                },
                formButtonPrimary: {
                  boxShadow: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 650,
                  minHeight: '3rem',
                },
                formFieldInput: {
                  borderColor: '#d8dce4',
                  boxShadow: 'none',
                  minHeight: '3rem',
                },
                formFieldLabel: {
                  color: '#353b45',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                },
                header: {
                  display: 'none',
                },
                main: {
                  gap: '1.25rem',
                },
                rootBox: {
                  width: '100%',
                },
                socialButtonsBlockButton: {
                  borderColor: '#d8dce4',
                  boxShadow: 'none',
                  fontWeight: 600,
                  minHeight: '3rem',
                },
              },
            }}
          />

          <p className="auth-security-note">
            Protected authentication · Access is limited to approved administrators
          </p>
        </div>
      </section>
    </main>
  )
}
