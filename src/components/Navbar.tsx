'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import DarkModeToggle from '@/components/DarkModeToggle'

export default function Navbar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #262626' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span style={{ color: '#f59e0b' }} className="text-xs font-bold tracking-widest uppercase">
              Sixth String Labs
            </span>
            <span className="text-white text-sm font-black tracking-wider uppercase">
              First Guitar Solo
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {!session ? (
              <>
                <Link href="/#how-it-works" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
                  How It Works
                </Link>
                <Link href="/#the-solo" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
                  The Solo
                </Link>
                <Link href="/#pricing" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link href="/faq" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
                  FAQ
                </Link>
                <Link href="/login" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
                  Log In
                </Link>
                <Link
                  href="/register"
                  style={{ backgroundColor: '#f59e0b', color: '#000000' }}
                  className="text-sm font-bold px-4 py-2 rounded hover:opacity-90 transition-opacity"
                >
                  Start Learning — $25
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/lessons" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
                  Lessons
                </Link>
                <Link href="/coach" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
                  AI Coach
                </Link>
                <Link href="/progress" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
                  Progress
                </Link>
                <Link href="/settings" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
                  Settings
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin" style={{ color: '#f59e0b' }} className="text-sm hover:opacity-80 transition-opacity">
                    Admin
                  </Link>
                )}
                <DarkModeToggle />
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{ color: '#a3a3a3' }}
                  className="text-sm hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-white mb-1"></div>
            <div className="w-5 h-0.5 bg-white mb-1"></div>
            <div className="w-5 h-0.5 bg-white"></div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ borderTop: '1px solid #262626' }} className="md:hidden py-4 flex flex-col gap-4">
            {!session ? (
              <>
                <Link href="/#how-it-works" style={{ color: '#a3a3a3' }} className="text-sm" onClick={() => setMobileOpen(false)}>How It Works</Link>
                <Link href="/#the-solo" style={{ color: '#a3a3a3' }} className="text-sm" onClick={() => setMobileOpen(false)}>The Solo</Link>
                <Link href="/#pricing" style={{ color: '#a3a3a3' }} className="text-sm" onClick={() => setMobileOpen(false)}>Pricing</Link>
                <Link href="/faq" style={{ color: '#a3a3a3' }} className="text-sm" onClick={() => setMobileOpen(false)}>FAQ</Link>
                <Link href="/login" style={{ color: '#a3a3a3' }} className="text-sm" onClick={() => setMobileOpen(false)}>Log In</Link>
                <Link
                  href="/register"
                  style={{ backgroundColor: '#f59e0b', color: '#000000' }}
                  className="text-sm font-bold px-4 py-2 rounded inline-block w-fit"
                  onClick={() => setMobileOpen(false)}
                >
                  Start Learning — $25
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" style={{ color: '#a3a3a3' }} className="text-sm" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Link href="/lessons" style={{ color: '#a3a3a3' }} className="text-sm" onClick={() => setMobileOpen(false)}>Lessons</Link>
                <Link href="/coach" style={{ color: '#a3a3a3' }} className="text-sm" onClick={() => setMobileOpen(false)}>AI Coach</Link>
                <Link href="/progress" style={{ color: '#a3a3a3' }} className="text-sm" onClick={() => setMobileOpen(false)}>Progress</Link>
                <Link href="/settings" style={{ color: '#a3a3a3' }} className="text-sm" onClick={() => setMobileOpen(false)}>Settings</Link>
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin" style={{ color: '#f59e0b' }} className="text-sm" onClick={() => setMobileOpen(false)}>Admin</Link>
                )}
                <button onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false) }} style={{ color: '#a3a3a3' }} className="text-sm text-left">Sign Out</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
