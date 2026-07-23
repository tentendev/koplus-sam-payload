import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'

import './auth.css'

const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function ClerkLayout({ children }: { children: ReactNode }) {
  return (
    <html className={inter.variable} lang="en">
      <body className="auth-body">
        <ClerkProvider
          appearance={{
            cssLayerName: 'clerk',
            options: {
              animations: true,
              elevation: 'flush',
            },
            variables: {
              borderRadius: '0.75rem',
              colorBackground: '#ffffff',
              colorBorder: '#d8dce4',
              colorDanger: '#c63f3f',
              colorForeground: '#20242b',
              colorInput: '#f4f5f7',
              colorInputForeground: '#20242b',
              colorMuted: '#eef0f4',
              colorMutedForeground: '#68707d',
              colorNeutral: '#69717f',
              colorPrimary: '#20242b',
              colorPrimaryForeground: '#ffffff',
              colorRing: 'rgba(32, 36, 43, 0.28)',
              colorShadow: 'rgba(32, 36, 43, 0.10)',
              fontFamily: 'var(--font-inter), Inter, Arial, sans-serif',
              fontFamilyButtons: 'var(--font-inter), Inter, Arial, sans-serif',
              fontSize: '0.9375rem',
              fontWeight: {
                bold: 700,
                medium: 500,
                normal: 400,
                semibold: 600,
              },
              spacing: '1rem',
            },
          }}
          dynamic
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
