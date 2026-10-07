import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function AdminRevenuePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const now = new Date()
  const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30)
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [paidUsers, totalUsers, recentPaid, allPaid] = await Promise.all([
    prisma.user.count({ where: { purchaseStatus: 'PAID' } }),
    prisma.user.count(),
    prisma.user.findMany({
      where: { purchaseStatus: 'PAID', updatedAt: { gte: thirtyDaysAgo } },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, email: true, name: true, updatedAt: true, stripeCustomerId: true },
    }),
    prisma.user.findMany({
      where: { purchaseStatus: 'PAID' },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, email: true, name: true, updatedAt: true, stripeCustomerId: true },
    }),
  ])

  const totalRevenue = paidUsers * 25
  const monthRevenue = allPaid.filter((u) => u.updatedAt >= thisMonthStart).length * 25
  const last30Revenue = recentPaid.length * 25
  const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers * 100).toFixed(1) : '0.0'

  // Revenue by day — last 30 days
  const revenueByDayMap: Record<string, number> = {}
  const cutoffKey = thirtyDaysAgo.toISOString().slice(0, 10)
  for (const u of allPaid) {
    const key = u.updatedAt.toISOString().slice(0, 10)
    if (key >= cutoffKey) {
      revenueByDayMap[key] = (revenueByDayMap[key] ?? 0) + 25
    }
  }

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now); d.setDate(now.getDate() - (29 - i))
    return d.toISOString().slice(0, 10)
  })

  const revenueByDay = last30Days.map((key) => ({
    date: key,
    revenue: revenueByDayMap[key] ?? 0,
  }))
  const maxDayRevenue = Math.max(...revenueByDay.map((d) => d.revenue), 1)

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <h1 className="text-2xl font-black text-white uppercase mb-6">Revenue</h1>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              {
                label: 'Total Revenue',
                value: `$${totalRevenue.toLocaleString()}`,
                sub: `${paidUsers} paid users × $25`,
                color: '#f59e0b',
              },
              {
                label: 'This Month',
                value: `$${monthRevenue.toLocaleString()}`,
                sub: `${monthRevenue / 25} conversions this month`,
                color: '#86efac',
              },
              {
                label: 'Last 30 Days',
                value: `$${last30Revenue.toLocaleString()}`,
                sub: `${recentPaid.length} conversions`,
                color: '#93c5fd',
              },
              {
                label: 'Conversion Rate',
                value: `${conversionRate}%`,
                sub: `${paidUsers} of ${totalUsers} users`,
                color: '#c4b5fd',
              },
            ].map((s) => (
              <div key={s.label} style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-4">
                <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-1">{s.label}</p>
                <p style={{ color: s.color }} className="text-2xl font-black">{s.value}</p>
                <p style={{ color: '#404040' }} className="text-xs mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Revenue chart — last 30 days */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5 mb-6">
            <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Revenue — Last 30 Days</h2>
            <div className="flex items-end gap-1 h-32">
              {revenueByDay.map(({ date, revenue }) => (
                <div
                  key={date}
                  className="flex-1"
                  style={{
                    height: revenue > 0 ? `${Math.max((revenue / maxDayRevenue) * 100, 4)}%` : '0%',
                    backgroundColor: revenue > 0 ? '#f59e0b' : '#1a1a1a',
                    borderRadius: '2px 2px 0 0',
                    minHeight: revenue > 0 ? 4 : 0,
                    alignSelf: 'flex-end',
                  }}
                  title={`${date}: $${revenue}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span style={{ color: '#404040' }} className="text-xs">30d ago</span>
              <span style={{ color: '#404040' }} className="text-xs">today</span>
            </div>
            <p style={{ color: '#525252' }} className="text-xs mt-2">
              Amber bar = $25 per paid conversion · hover for date + amount
            </p>
          </div>

          {/* All-time transactions table */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl overflow-hidden mb-4">
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #1f1f1f' }}>
              <h2 className="text-white font-bold text-xs uppercase tracking-wider">All-Time Revenue Transactions</h2>
              <p style={{ color: '#525252' }} className="text-xs mt-0.5">{allPaid.length} transactions · most recent first</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1f1f1f', backgroundColor: '#0d0d0d' }}>
                    {['Date', 'Email', 'Amount', 'Stripe ID'].map((h) => (
                      <th key={h} style={{ color: '#525252' }} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allPaid.map((user) => (
                    <tr
                      key={user.id}
                      style={{ borderBottom: '1px solid #161616' }}
                      className="hover:bg-neutral-900 transition-colors"
                    >
                      <td style={{ color: '#737373' }} className="px-4 py-3 text-xs whitespace-nowrap">
                        {user.updatedAt.toLocaleDateString()}{' '}
                        <span style={{ color: '#404040' }}>
                          {user.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <Link href={`/admin/users/${user.id}`} style={{ color: '#f59e0b' }} className="hover:underline">
                          {user.email}
                        </Link>
                        {user.name && (
                          <span style={{ color: '#525252' }} className="ml-1.5">({user.name})</span>
                        )}
                      </td>
                      <td style={{ color: '#86efac' }} className="px-4 py-3 text-xs font-bold">$25</td>
                      <td style={{ color: '#404040', fontFamily: 'monospace' }} className="px-4 py-3 text-xs">
                        {user.stripeCustomerId
                          ? `${user.stripeCustomerId.slice(0, 20)}…`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                  {allPaid.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center" style={{ color: '#525252' }}>
                        No transactions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p style={{ color: '#404040' }} className="text-xs text-center pb-4">
            Revenue calculated at $25/user · Does not account for refunds or chargebacks
          </p>
        </main>
      </div>
    </div>
  )
}
