'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Sidebar nav entry (registered via admin.components.afterNavLinks) that opens
// the dedicated Guides page. Uses Payload's `nav__link` class so it matches the
// other nav items.
export const GuidesNavLink: React.FC = () => {
  const pathname = usePathname()
  const active = pathname?.endsWith('/admin/user-manual')
  return (
    <Link
      href="/admin/user-manual"
      className={`nav__link${active ? ' nav__link--active' : ''}`}
      style={{ display: 'flex', alignItems: 'center', gap: 10 }}
    >
      <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>📖</span>
      <span className="nav__link-label">User Manual</span>
    </Link>
  )
}

export default GuidesNavLink
