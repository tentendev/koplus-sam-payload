'use client'

import { ClerkProvider } from '@clerk/nextjs'
import type { ReactNode } from 'react'

export function ClerkAdminProvider({ children }: { children: ReactNode }) {
  return <ClerkProvider dynamic>{children}</ClerkProvider>
}
