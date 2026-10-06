'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Overview', icon: '⊞', exact: true },
  { href: '/admin/users', label: 'Users', icon: '◈' },
  { href: '/admin/analytics', label: 'Analytics', icon: '◉' },
  { href: '/admin/coach', label: 'Coach Messages', icon: '◎' },
  { href: '/admin/feedback', label: 'Feedback', icon: '★' },
  { href: '/admin/upload', label: 'Audio Assets', icon: '▷' },
  { href: '/admin/announcements', label: 'Announcements', icon: '◬' },
  { href: '/admin/coupons', label: 'Coupons', icon: '◇' },
  { href: '/admin/support', label: 'Support', icon: '◻' },
  { href: '/admin/logs', label: 'Action Log', icon: '≡' },
  { href: '/admin/content', label: 'Content', icon: '✎' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{ backgroundColor: '#0d0d0d', borderRight: '1px solid #1f1f1f', width: '220px', minWidth: '220px' }}
      className="hidden md:flex flex-col py-6"
    >
      <div className="px-5 mb-7">
        <p style={{ color: '#f59e0b' }} className="text-xs font-black uppercase tracking-widest mb-0.5">Admin</p>
        <p style={{ color: '#404040' }} className="text-xs">Sixth String Labs</p>
      </div>

      <nav className="flex flex-col gap-0.5 px-3">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                backgroundColor: isActive ? '#1a1a1a' : 'transparent',
                color: isActive ? '#ffffff' : '#737373',
                borderLeft: isActive ? '2px solid #f59e0b' : '2px solid transparent',
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <span style={{ color: isActive ? '#f59e0b' : '#404040' }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto px-5 pt-6" style={{ borderTop: '1px solid #1f1f1f' }}>
        <Link href="/dashboard" style={{ color: '#404040' }} className="text-xs hover:text-white transition-colors">
          ← Back to App
        </Link>
      </div>
    </aside>
  )
}
