import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function getWeekKey(date: Date): string {
  return getWeekStart(date).toISOString().slice(0, 10)
}

function formatWeekLabel(weekKey: string): string {
  const d = new Date(weekKey + 'T00:00:00Z')
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function retentionColor(pct: number | null): string {
  if (pct === null) return '#2a2a2a'
  if (pct >= 50) return '#22c55e'
  if (pct >= 25) return '#f59e0b'
  return '#525252'
}

export default async function CohortAnalyticsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const now = new Date()

  const [paidUsers, allSessions] = await Promise.all([
    prisma.user.findMany({
      where: { purchaseStatus: 'PAID' },
      select: { id: true, createdAt: true },
    }),
    prisma.practiceSession.findMany({
      select: { userId: true, createdAt: true },
    }),
  ])

  // Session lookup: userId → array of session Date objects
  const sessionsByUser: Record<string, Date[]> = {}
  for (const s of allSessions) {
    if (!sessionsByUser[s.userId]) sessionsByUser[s.userId] = []
    sessionsByUser[s.userId].push(new Date(s.createdAt))
  }

  // Build last 12 distinct Monday-week keys, newest first
  const weekKeySet = new Set<string>()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    weekKeySet.add(getWeekKey(d))
  }
  const sortedWeeks = Array.from(weekKeySet).sort().reverse() // newest first in display

  // Group paid users by their signup week
  const usersByCohort: Record<string, Array<{ id: string; createdAt: Date }>> = {}
  for (const u of paidUsers) {
    const wk = getWeekKey(new Date(u.createdAt))
    if (!usersByCohort[wk]) usersByCohort[wk] = []
    usersByCohort[wk].push(u)
  }

  // Compute retention for each cohort week
  const cohortData = sortedWeeks.map((weekKey) => {
    const users = usersByCohort[weekKey] ?? []
    const cohortStart = new Date(weekKey + 'T00:00:00Z')
    const size = users.length

    const retentionByWeek: Array<number | null> = [1, 2, 3, 4].map((wkOffset) => {
      const windowStart = new Date(cohortStart)
      windowStart.setDate(cohortStart.getDate() + (wkOffset - 1) * 7)
      const windowEnd = new Date(cohortStart)
      windowEnd.setDate(cohortStart.getDate() + wkOffset * 7)

      // Window entirely in the future — show blank
      if (windowStart.getTime() > now.getTime()) return null

      if (size === 0) return 0

      const activeCount = users.filter((u) => {
        const sessions = sessionsByUser[u.id] ?? []
        return sessions.some(
          (s) => s.getTime() >= windowStart.getTime() && s.getTime() < windowEnd.getTime()
        )
      }).length

      return Math.round((activeCount / size) * 100)
    })

    return { weekKey, size, retentionByWeek }
  })

  // Total paid users with at least one session (overall active)
  const everActiveCount = paidUsers.filter(u => (sessionsByUser[u.id]?.length ?? 0) > 0).length
  const overallRetentionPct = paidUsers.length > 0
    ? Math.round((everActiveCount / paidUsers.length) * 100)
    : 0

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <h1 className="text-2xl font-black text-white uppercase mb-2">Cohort Retention</h1>
          <p style={{ color: '#525252' }} className="text-sm mb-6">
            Weekly cohorts — % still active 1 / 2 / 3 / 4 weeks after signup
          </p>

          {/* Summary stat */}
          <div className="grid grid-cols-3 gap-3 mb-7">
            {([
              { label: 'Paid Users', value: String(paidUsers.length), color: '#f59e0b' },
              { label: 'Ever Practiced', value: String(everActiveCount), color: '#86efac' },
              { label: 'Overall Activation', value: `${overallRetentionPct}%`, color: '#93c5fd' },
            ] as Array<{ label: string; value: string; color: string }>).map((s) => (
              <div key={s.label} style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-4">
                <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-1">{s.label}</p>
                <p style={{ color: s.color }} className="text-2xl font-black">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Cohort table */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl overflow-hidden">
            {/* Header row */}
            <div
              className="grid"
              style={{ gridTemplateColumns: '200px 80px repeat(4, 90px)' }}
            >
              {(['Cohort Week', 'Users', 'Week 1', 'Week 2', 'Week 3', 'Week 4'] as string[]).map((h) => (
                <div
                  key={h}
                  style={{
                    backgroundColor: '#0d0d0d',
                    borderBottom: '1px solid #1f1f1f',
                    color: '#f59e0b',
                  }}
                  className="px-4 py-3 text-xs font-bold uppercase tracking-wider"
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {cohortData.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p style={{ color: '#525252' }} className="text-sm">No cohort data yet.</p>
              </div>
            ) : (
              cohortData.map((row, rowIdx) => (
                <div
                  key={row.weekKey}
                  className="grid"
                  style={{
                    gridTemplateColumns: '200px 80px repeat(4, 90px)',
                    borderBottom: rowIdx < cohortData.length - 1 ? '1px solid #1a1a1a' : 'none',
                  }}
                >
                  {/* Cohort label */}
                  <div className="px-4 py-3">
                    <p className="text-white text-sm font-bold">{formatWeekLabel(row.weekKey)}</p>
                  </div>
                  {/* Cohort size */}
                  <div className="px-4 py-3 text-center">
                    <p style={{ color: row.size > 0 ? '#737373' : '#2a2a2a' }} className="text-sm font-bold">
                      {row.size}
                    </p>
                  </div>
                  {/* Retention cells */}
                  {row.retentionByWeek.map((pct, i) => (
                    <div key={i} className="px-4 py-3 text-center">
                      {pct === null ? (
                        <span style={{ color: '#2a2a2a' }} className="text-sm">—</span>
                      ) : row.size === 0 ? (
                        <span style={{ color: '#2a2a2a' }} className="text-sm">—</span>
                      ) : (
                        <span
                          style={{ color: retentionColor(pct) }}
                          className="text-sm font-black"
                        >
                          {pct}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4">
            {([
              { color: '#22c55e', label: '≥50% retained' },
              { color: '#f59e0b', label: '25–49%' },
              { color: '#525252', label: '<25%' },
              { color: '#2a2a2a', label: 'Future week' },
            ] as Array<{ color: string; label: string }>).map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div style={{ backgroundColor: l.color, width: 10, height: 10, borderRadius: 2 }} />
                <span style={{ color: '#737373' }} className="text-xs">{l.label}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
