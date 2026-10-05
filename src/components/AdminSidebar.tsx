'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Overview', icon: '▦' },
  { href: '/admin/users', label: 'Users', icon: '◈' },
  { href: '/admin/upload', label: 'Audio Assets', icon: '◉' },
  { href: '/admin/feedback', label: 'Feedback', icon: '◷' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{ backgroundColor: '#111111', borderRight: '1px solid #262626', minWidth: '200px' }}
      className="hidden md:flex flex-col py-6"
    >
      <div className="px-4 mb-6">
        <p style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest">
          Admin Panel
        </p>
      </div>

      <nav className="flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                backgroundColor: isActive ? '#1a1a1a' : 'transparent',
                color: isActive ? '#ffffff' : '#a3a3a3',
                borderLeft: isActive ? '2px solid #f59e0b' : '2px solid transparent',
              }}
              className="flex items-center gap-3 px-3 py-2 rounded text-sm hover:text-white hover:bg-stone-900 transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto px-4 pt-6" style={{ borderTop: '1px solid #262626' }}>
        <Link href="/dashboard" style={{ color: '#a3a3a3' }} className="text-xs hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </div>
    </aside>
  )
}
