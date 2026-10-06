'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import DarkModeToggle from '@/components/DarkModeToggle'

export default function Navbar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <>
      <style>{`
        .nav-link { position: relative; }
        .nav-link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 100%; height: 2px; background: linear-gradient(90deg, #f59e0b, #fde68a); transform: scaleX(0); transform-origin: center; transition: transform 0.2s ease; border-radius: 1px; }
        .nav-link.active::after, .nav-link:hover::after { transform: scaleX(1); }
        .mobile-nav-link { position: relative; }
        .mobile-nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 2px; background: linear-gradient(90deg, #f59e0b, #fde68a); transform: scaleX(0); transform-origin: left; transition: transform 0.2s ease; border-radius: 1px; }
        .mobile-nav-link.active::after, .mobile-nav-link:hover::after { transform: scaleX(1); }
      `}</style>

      <nav
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(10,10,10,0.85)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
        className="sticky top-0 z-50"
      >
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
                  <Link
                    href="/dashboard"
                    style={{ color: isActive('/dashboard') ? '#f59e0b' : '#a3a3a3' }}
                    className={`text-sm hover:text-white transition-colors nav-link${isActive('/dashboard') ? ' active' : ''}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/lessons"
                    style={{ color: isActive('/lessons') ? '#f59e0b' : '#a3a3a3' }}
                    className={`text-sm hover:text-white transition-colors nav-link${isActive('/lessons') ? ' active' : ''}`}
                  >
                    Lessons
                  </Link>
                  <Link
                    href="/coach"
                    style={{ color: isActive('/coach') ? '#f59e0b' : '#a3a3a3' }}
                    className={`text-sm hover:text-white transition-colors nav-link${isActive('/coach') ? ' active' : ''}`}
                  >
                    AI Coach
                  </Link>
                  <Link
                    href="/progress"
                    style={{ color: isActive('/progress') ? '#f59e0b' : '#a3a3a3' }}
                    className={`text-sm hover:text-white transition-colors nav-link${isActive('/progress') ? ' active' : ''}`}
                  >
                    Progress
                  </Link>
                  <Link
                    href="/settings"
                    style={{ color: isActive('/settings') ? '#f59e0b' : '#a3a3a3' }}
                    className={`text-sm hover:text-white transition-colors nav-link${isActive('/settings') ? ' active' : ''}`}
                  >
                    Settings
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      style={{ color: '#f59e0b' }}
                      className={`text-sm hover:opacity-80 transition-opacity nav-link${isActive('/admin') ? ' active' : ''}`}
                    >
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
        </div>
      </nav>

      {/* Mobile backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Mobile drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 280,
          backgroundColor: '#0d0d0d',
          borderLeft: '1px solid #262626',
          padding: 24,
          zIndex: 50,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: '#a3a3a3',
            fontSize: '1.5rem',
            lineHeight: 1,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Close menu"
        >
          ×
        </button>
        <div className="flex flex-col gap-6 mt-8">
          {!session ? (
            <>
              <Link href="/#how-it-works" style={{ color: '#a3a3a3' }} className="text-sm mobile-nav-link" onClick={() => setMobileOpen(false)}>How It Works</Link>
              <Link href="/#the-solo" style={{ color: '#a3a3a3' }} className="text-sm mobile-nav-link" onClick={() => setMobileOpen(false)}>The Solo</Link>
              <Link href="/#pricing" style={{ color: '#a3a3a3' }} className="text-sm mobile-nav-link" onClick={() => setMobileOpen(false)}>Pricing</Link>
              <Link href="/faq" style={{ color: '#a3a3a3' }} className="text-sm mobile-nav-link" onClick={() => setMobileOpen(false)}>FAQ</Link>
              <Link href="/login" style={{ color: '#a3a3a3' }} className="text-sm mobile-nav-link" onClick={() => setMobileOpen(false)}>Log In</Link>
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
              <Link
                href="/dashboard"
                style={{ color: isActive('/dashboard') ? '#f59e0b' : '#a3a3a3' }}
                className={`text-sm mobile-nav-link${isActive('/dashboard') ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/lessons"
                style={{ color: isActive('/lessons') ? '#f59e0b' : '#a3a3a3' }}
                className={`text-sm mobile-nav-link${isActive('/lessons') ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                Lessons
              </Link>
              <Link
                href="/coach"
                style={{ color: isActive('/coach') ? '#f59e0b' : '#a3a3a3' }}
                className={`text-sm mobile-nav-link${isActive('/coach') ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                AI Coach
              </Link>
              <Link
                href="/progress"
                style={{ color: isActive('/progress') ? '#f59e0b' : '#a3a3a3' }}
                className={`text-sm mobile-nav-link${isActive('/progress') ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                Progress
              </Link>
              <Link
                href="/settings"
                style={{ color: isActive('/settings') ? '#f59e0b' : '#a3a3a3' }}
                className={`text-sm mobile-nav-link${isActive('/settings') ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                Settings
              </Link>
              {session.user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  style={{ color: '#f59e0b' }}
                  className={`text-sm mobile-nav-link${isActive('/admin') ? ' active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false) }}
                style={{ color: '#a3a3a3' }}
                className="text-sm text-left"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
