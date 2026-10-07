import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const resendConfigured = !!process.env.RESEND_API_KEY
  const nodeEnv = process.env.NODE_ENV ?? 'unknown'

  const configRows = [
    { label: 'Database', value: 'Connected (Neon PostgreSQL)', ok: true },
    { label: 'Auth', value: 'NextAuth v4 · JWT strategy', ok: true },
    { label: 'Payment', value: 'Stripe · $25 one-time', ok: true },
    { label: 'AI', value: 'Groq · llama3-8b-8192', ok: true },
    {
      label: 'Email',
      value: resendConfigured ? 'Resend · configured' : 'Resend · ⚠ RESEND_API_KEY missing',
      ok: resendConfigured,
    },
    { label: 'Environment', value: nodeEnv, ok: true },
  ]

  const quickLinks = [
    { icon: '💳', title: 'Stripe Dashboard', sub: 'Payments, subscriptions, customers', href: 'https://dashboard.stripe.com', external: true },
    { icon: '▲', title: 'Vercel Dashboard', sub: 'Deployments, logs, env vars', href: 'https://vercel.com/dashboard', external: true },
    { icon: '🐘', title: 'Neon Database', sub: 'PostgreSQL console & queries', href: 'https://console.neon.tech', external: true },
    { icon: '✉', title: 'Resend Dashboard', sub: 'Email logs & API keys', href: 'https://resend.com/emails', external: true },
    { icon: '📋', title: 'View Action Log', sub: 'Admin activity history', href: '/admin/logs', external: false },
    { icon: '📊', title: 'View Analytics', sub: 'User engagement & funnels', href: '/admin/analytics', external: false },
  ]

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <h1 className="text-2xl font-black text-white uppercase mb-6">Site Settings</h1>

          {/* Read-only config */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl overflow-hidden mb-6">
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #1f1f1f' }}>
              <h2 className="text-white font-bold text-xs uppercase tracking-wider">Configuration Overview</h2>
              <p style={{ color: '#525252' }} className="text-xs mt-0.5">Read-only snapshot of active integrations</p>
            </div>
            <div className="divide-y" style={{ '--tw-divide-opacity': '1' } as React.CSSProperties}>
              {configRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-5 py-3"
                  style={{ borderBottom: '1px solid #161616' }}
                >
                  <span style={{ color: '#737373' }} className="text-xs uppercase tracking-wider w-28 flex-shrink-0">
                    {row.label}
                  </span>
                  <span
                    className="text-xs text-right"
                    style={{ color: row.ok ? '#e5e5e5' : '#fbbf24' }}
                  >
                    {row.value}
                  </span>
                  <span
                    className="ml-4 flex-shrink-0 text-xs font-bold"
                    style={{ color: row.ok ? '#86efac' : '#fbbf24' }}
                  >
                    {row.ok ? '●' : '⚠'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5 mb-6">
            <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group block rounded-lg p-4 transition-colors"
                  style={{ backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a' }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 mt-0.5">{link.icon}</span>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-bold transition-colors group-hover:text-amber-400"
                        style={{ color: '#e5e5e5' }}
                      >
                        {link.title}
                        {link.external && (
                          <span style={{ color: '#525252' }} className="ml-1 text-xs font-normal">↗</span>
                        )}
                      </p>
                      <p style={{ color: '#525252' }} className="text-xs mt-0.5">{link.sub}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Announcements shortcut */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5 mb-6">
            <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Announcements</h2>
            <p style={{ color: '#737373' }} className="text-xs mb-3">
              Create site-wide banners that appear for all users. Use for maintenance notices, new feature launches, or important updates.
            </p>
            <Link
              href="/admin/announcements"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#1a1200', border: '1px solid #d97706', color: '#fbbf24' }}
            >
              Manage Announcements →
            </Link>
          </div>

          {/* Danger Zone */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: '#1a0000', border: '1px solid #7f1d1d' }}
          >
            <h2 className="font-bold text-xs uppercase tracking-wider mb-4" style={{ color: '#fca5a5' }}>
              Danger Zone
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/api/admin/export"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#2d0000', border: '1px solid #7f1d1d', color: '#fca5a5' }}
              >
                Export all user data
              </Link>
              <Link
                href="/admin/logs"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#2d0000', border: '1px solid #7f1d1d', color: '#fca5a5' }}
              >
                View action log
              </Link>
            </div>
            <p style={{ color: '#7f1d1d' }} className="text-xs mt-3">
              Data exports contain all user emails, purchase status, and progress records. Handle with care.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
