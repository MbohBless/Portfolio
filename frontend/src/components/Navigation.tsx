'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Navigation() {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path)
  }

  const links = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/publications', label: 'Research' },
    { href: '/blog', label: 'Blog' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="text-lg font-bold tracking-tight hover:opacity-70 transition-opacity"
          >
            <span className="text-black">PORTFOLIO</span>
          </Link>

          <div className="flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors relative group',
                  isActive(link.href)
                    ? 'text-black'
                    : 'text-gray-500 hover:text-black'
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-4 left-0 right-0 h-px bg-black" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
