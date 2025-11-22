'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { BackgroundPattern } from '@/components/BackgroundPattern'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    // Admin routes have their own layout
    return <>{children}</>
  }

  // Public routes get navigation, footer, and background pattern
  return (
    <>
      <BackgroundPattern />
      <Navigation />
      <div className="pt-16">
        {children}
      </div>
      <Footer />
    </>
  )
}
