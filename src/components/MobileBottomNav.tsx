'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

// Inline SVGs — 20×20, currentColor stroke, strokeWidth 1.5, round linecap/linejoin

function IconDashboard() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function IconLessons() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="7" height="7" rx="1" />
      <rect x="14" y="4" width="7" height="7" rx="1" />
      <rect x="3" y="13" width="7" height="7" rx="1" />
      <rect x="14" y="13" width="7" height="7" rx="1" />
    </svg>
  )
}

function IconCoach() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconProgress() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function IconMySolo() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Guitar body simplified as a music note */}
      <circle cx="9" cy="18" r="3" />
      <path d="M12 18V7" />
      <path d="M12 7h5" />
      <path d="M17 7v4" />
    </svg>
  )
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', Icon: IconDashboard },
  { href: '/lessons', label: 'Lessons', Icon: IconLessons },
  { href: '/coach', label: 'Coach', Icon: IconCoach },
  { href: '/progress', label: 'Progress', Icon: IconProgress },
  { href: '/my-solo', label: 'My Solo', Icon: IconMySolo },
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
      <div className="grid grid-cols-5">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive =
            pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 transition-colors"
              style={{
                color: isActive ? '#f59e0b' : '#525252',
                height: 60,
                position: 'relative',
              }}
            >
              <Icon />
              <span className="text-xs font-medium">{label}</span>
              {/* Amber active dot */}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: '#f59e0b',
                  }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
