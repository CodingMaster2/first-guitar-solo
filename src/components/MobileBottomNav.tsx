'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: '⌂' },
  { href: '/lessons', label: 'Lessons', icon: '◉' },
  { href: '/coach', label: 'Coach', icon: '⬡' },
  { href: '/progress', label: 'Progress', icon: '↑' },
]

export default function MobileBottomNav() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session?.user || session.user.purchaseStatus !== 'PAID') return null

  return (
    <nav
      style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #262626' }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-safe"
    >
      <div className="grid grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center py-3 gap-1 transition-colors"
              style={{ color: isActive ? '#f59e0b' : '#525252' }}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
