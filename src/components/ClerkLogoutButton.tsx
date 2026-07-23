'use client'

import { useClerk } from '@clerk/nextjs'
import { LogOutIcon } from '@payloadcms/ui'
import { useState } from 'react'

export function ClerkLogoutButton() {
  const clerk = useClerk()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)

    try {
      await clerk.signOut({ redirectUrl: '/' })
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <button
      aria-label="Log out"
      className="nav__log-out"
      disabled={isSigningOut}
      onClick={handleSignOut}
      title="Log out"
      type="button"
    >
      <LogOutIcon />
    </button>
  )
}
