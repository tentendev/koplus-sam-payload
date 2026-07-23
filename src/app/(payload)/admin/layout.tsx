import { auth } from '@clerk/nextjs/server'
import type { ReactNode } from 'react'

export default async function AdminAuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, redirectToSignIn } = await auth()

  if (!isAuthenticated) {
    return redirectToSignIn()
  }

  return children
}
