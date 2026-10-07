import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'

export default async function AdminFunnelPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)
  const fourteenDaysAgo = new Date(now)
  fourteenDaysAgo.setDate(now.getDate() - 14)

  const [
    registrations,
    purchases,
    day1Users,
    day7Users,
    graduated,
    registrationsLast7,
    registrationsPrev7,
    utmBreakdown,
    purchasesByUtm,
    recentEvents,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { purchaseStatus: 'PAID' } }),
    prisma.user.count({ where: { progress: { some: { day: 1 } } } }),
    prisma.user.count({ where: { progress: { some: { day: 7, completed: true } } } }),
    prisma.user.count({ where: { profile: { soloCompleted: true } } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({
      where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
    }),
    prisma.user.groupBy({
      by: ['utmSource'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),
    prisma.user.groupBy({
      by: ['utmSource'],
      where: { purchaseStatus: 'PAID' },
      _count: { id: true },
    }),
    prisma.funnelEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: { select: { email: true } } },
    }),
  ])

  const purchasesMap = new Map(purchasesByUtm.map((r) => [r.utmSource, r._count.id]))

  const regDelta =
    registrationsPrev7 > 0
      ? Math.round(((registrationsLast7 - registrationsPrev7) / registrationsPrev7) * 100)
      : null

  const funnelSteps = [
    { label: 'Registered', count: registrations, prev: null as number | null },
    { label: 'Purchased', count: purchases, prev: registrations },
    { label: 'Started Day 1', count: day1Users, prev: purchases },
    { label: 'Completed Day 7', count: day7Users, prev: day1Users },
    { label: 'Graduated', count: graduated, prev: day7Users },
  ]

  const utmRows = utmBreakdown.map((r) => ({
    source: r.utmSource ?? '(direct)',
    registrations: r._count.id,
    purchases: purchasesMap.get(r.utmSource) ?? 0,
    rate:
      r._count.id > 0
        ? Math.round(((purchasesMap.get(r.utmSource) ?? 0) / r._count.id) * 100)
        : 0,
  }))

  const maxUtmReg = Math.max(...utmRows.map((r) => r.registrations), 1)

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="mb-7">
            <h1 className="text-2xl font-black text-white uppercase">Funnel</h1>
            <p style={{ color: '#525252' }} className="text-xs mt-1">
              Full conversion analytics
            </p>
          </div>

          {/* Section A: Conversion Funnel */}
          <div
            style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
            className="rounded-xl p-6 mb-5"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-xs uppercase tracking-wider">
                Conversion Funnel
              </h2>
              {regDelta !== null && (
                <span
                  style={{ color: regDelta >= 0 ? '#86efac' : '#fca5a5' }}
                  className="text-xs font-bold"
                >
                  Registrations {regDelta >= 0 ? '+' : ''}{regDelta}% vs prev 7d
                </span>
              )}
            </div>
            <div className="space-y-4">
              {funnelSteps.map((step) => {
                const pct = registrations > 0 ? (step.count / registrations) * 100 : 0
                const fromPrev =
                  step.prev !== null && step.prev > 0
                    ? Math.round((step.count / step.prev) * 100)
                    : null
                return (
                  <div key={step.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ color: '#a3a3a3' }} className="text-sm font-medium w-36">
                        {step.label}
                      </span>
                      <span className="text-white text-sm font-bold">
                        {step.count.toLocaleString()}
                        {fromPrev !== null && (
                          <span style={{ color: '#737373' }} className="text-xs font-normal ml-2">
                            ({fromPrev}% from prev)
                          </span>
                        )}
                      </span>
                    </div>
                    <div
                      style={{ backgroundColor: '#1f1f1f', height: 10, borderRadius: 5 }}
                      className="relative"
                    >
                      <div
                        style={{
                          width: `${Math.max(pct, 0.5)}%`,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: '#f59e0b',
                          opacity: step.prev === null ? 1 : 0.75,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section B: UTM Source Breakdown */}
          <div
            style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
            className="rounded-xl p-6 mb-5"
          >
            <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              UTM Source Breakdown
            </h2>
            {utmRows.length === 0 ? (
              <p style={{ color: '#525252' }} className="text-sm">
                No UTM source data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {utmRows.map((row) => (
                  <div key={row.source} className="flex items-center gap-4">
                    <span
                      style={{ color: '#a3a3a3', minWidth: '120px' }}
                      className="text-xs truncate"
                    >
                      {row.source}
                    </span>
                    <div className="flex-1" style={{ maxWidth: '200px' }}>
                      <div style={{ backgroundColor: '#1f1f1f', height: 6, borderRadius: 3 }}>
                        <div
                          style={{
                            width: `${(row.registrations / maxUtmReg) * 100}%`,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#f59e0b',
                            opacity: 0.7,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-white text-xs font-bold w-10 text-right">
                      {row.registrations}
                    </span>
                    <span style={{ color: '#86efac' }} className="text-xs w-10 text-right">
                      {row.purchases}
                    </span>
                    <span
                      style={{
                        color: row.rate >= 20 ? '#86efac' : row.rate >= 10 ? '#fbbf24' : '#737373',
                      }}
                      className="text-xs w-12 text-right font-bold"
                    >
                      {row.rate}%
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-4 pt-2" style={{ borderTop: '1px solid #1f1f1f' }}>
                  <span style={{ color: '#525252', minWidth: '120px' }} className="text-xs">
                    Source
                  </span>
                  <div className="flex-1" style={{ maxWidth: '200px' }} />
                  <span style={{ color: '#525252' }} className="text-xs w-10 text-right">
                    Reg
                  </span>
                  <span style={{ color: '#525252' }} className="text-xs w-10 text-right">
                    Paid
                  </span>
                  <span style={{ color: '#525252' }} className="text-xs w-12 text-right">
                    Rate
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section C: Recent Funnel Events */}
          <div
            style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
            className="rounded-xl p-6"
          >
            <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Recent Funnel Events
            </h2>
            {recentEvents.length === 0 ? (
              <p style={{ color: '#525252' }} className="text-sm">
                No funnel events recorded yet.
              </p>
            ) : (
              <div className="space-y-0">
                {recentEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="py-2.5 flex items-start gap-4"
                    style={{ borderBottom: '1px solid #1a1a1a' }}
                  >
                    <span
                      style={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #262626',
                        color: '#f59e0b',
                        borderRadius: 4,
                        padding: '1px 6px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        minWidth: '120px',
                        textAlign: 'center' as const,
                        flexShrink: 0,
                      }}
                    >
                      {evt.event}
                    </span>
                    <div className="flex-1 min-w-0">
                      {evt.user?.email && (
                        <p style={{ color: '#a3a3a3' }} className="text-xs truncate">
                          {evt.user.email}
                        </p>
                      )}
                      {evt.page && (
                        <p style={{ color: '#525252' }} className="text-xs truncate">
                          {evt.page}
                        </p>
                      )}
                    </div>
                    {evt.utmSource && (
                      <span
                        style={{
                          color: '#737373',
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #262626',
                          borderRadius: 4,
                          padding: '1px 6px',
                          fontSize: '0.68rem',
                          flexShrink: 0,
                        }}
                      >
                        {evt.utmSource}
                      </span>
                    )}
                    <span
                      style={{ color: '#404040', flexShrink: 0 }}
                      className="text-xs"
                    >
                      {new Date(evt.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
