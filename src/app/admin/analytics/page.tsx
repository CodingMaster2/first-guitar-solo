import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const now = new Date()
  const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30)
  const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(now.getDate() - 7)

  const [
    totalUsers,
    paidUsers,
    allUsers,
    allCompleted,
    practiceSessions,
    allProfiles,
    recentPractice7d,
    dayRatings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { purchaseStatus: 'PAID' } }),
    prisma.user.findMany({
      select: { id: true, createdAt: true, purchaseStatus: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.progress.findMany({
      where: { completed: true },
      select: { userId: true, day: true, completedAt: true },
    }),
    prisma.practiceSession.findMany({
      select: { duration: true, createdAt: true, userId: true },
    }),
    prisma.profile.findMany({
      select: { totalXP: true, streak: true, bestStreak: true, currentDay: true },
    }),
    prisma.practiceSession.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.progress.groupBy({
      by: ['day'],
      _avg: { rating: true },
      _count: { _all: true },
      where: { rating: { not: null } },
      orderBy: { day: 'asc' },
    }),
  ])

  const revenue = paidUsers * 25
  const conversion = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : '0'

  // Signups per day last 30 days
  const signupsByDay: Record<string, number> = {}
  const paidByDay: Record<string, number> = {}
  for (const u of allUsers) {
    const key = u.createdAt.toISOString().slice(0, 10)
    const cutoff = thirtyDaysAgo.toISOString().slice(0, 10)
    if (key >= cutoff) {
      signupsByDay[key] = (signupsByDay[key] ?? 0) + 1
      if (u.purchaseStatus === 'PAID') paidByDay[key] = (paidByDay[key] ?? 0) + 1
    }
  }

  // Completion funnel - how many distinct users completed each day
  const dayUserCounts: Record<number, Set<string>> = {}
  for (const p of allCompleted) {
    if (!dayUserCounts[p.day]) dayUserCounts[p.day] = new Set()
    dayUserCounts[p.day].add(p.userId)
  }
  const funnelData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    count: dayUserCounts[i + 1]?.size ?? 0,
  }))
  const maxFunnelCount = Math.max(...funnelData.map((d) => d.count), 1)

  // Practice time stats
  const totalPracticeMin = practiceSessions.reduce((s, p) => s + p.duration, 0)
  const avgSessionMin = practiceSessions.length > 0
    ? Math.round(totalPracticeMin / practiceSessions.length)
    : 0
  const uniquePractitioners = new Set(practiceSessions.map((p) => p.userId)).size
  const avgMinPerUser = uniquePractitioners > 0 ? Math.round(totalPracticeMin / uniquePractitioners) : 0

  // XP stats
  const totalXP = allProfiles.reduce((s, p) => s + p.totalXP, 0)
  const avgXP = allProfiles.length > 0 ? Math.round(totalXP / allProfiles.length) : 0
  const maxStreak = Math.max(...allProfiles.map((p) => p.bestStreak), 0)

  // User cohorts: % who reached each milestone
  const usersWhoReachedDay: Record<number, number> = {}
  for (const p of allCompleted) {
    if (!usersWhoReachedDay[p.day] || true) {
      usersWhoReachedDay[p.day] = (usersWhoReachedDay[p.day] ?? 0) + 1
    }
  }

  const milestones = [1, 7, 14, 21, 30]
  const milestoneData = milestones.map((m) => ({
    day: m,
    count: dayUserCounts[m]?.size ?? 0,
    pct: paidUsers > 0 ? Math.round(((dayUserCounts[m]?.size ?? 0) / paidUsers) * 100) : 0,
  }))

  const maxSignups = Math.max(...Object.values(signupsByDay), 1)

  // Build last 30 day labels
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now); d.setDate(now.getDate() - (29 - i))
    return d.toISOString().slice(0, 10)
  })

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <h1 className="text-2xl font-black text-white uppercase mb-7">Analytics</h1>

          {/* Revenue block */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
            {[
              { label: 'Total Revenue', value: `$${revenue.toLocaleString()}`, sub: `${paidUsers} paid users × $25`, color: '#f59e0b' },
              { label: 'Conversion Rate', value: `${conversion}%`, sub: `${paidUsers} of ${totalUsers} signed up`, color: '#86efac' },
              { label: 'Active 7d', value: String(recentPractice7d.length), sub: `${Math.round((recentPractice7d.length / Math.max(paidUsers, 1)) * 100)}% of paid users`, color: '#93c5fd' },
              { label: 'Avg XP / User', value: String(avgXP), sub: `${totalXP.toLocaleString()} total XP earned`, color: '#c4b5fd' },
            ].map((s) => (
              <div key={s.label} style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-4">
                <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-1">{s.label}</p>
                <p style={{ color: s.color }} className="text-2xl font-black">{s.value}</p>
                <p style={{ color: '#404040' }} className="text-xs mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            {/* Signup chart */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5">
              <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Signups vs Paid — Last 30 Days</h2>
              <div className="flex items-end gap-1 h-32">
                {last30.map((key) => {
                  const total = signupsByDay[key] ?? 0
                  const paid = paidByDay[key] ?? 0
                  return (
                    <div key={key} className="flex-1 flex flex-col items-stretch gap-0.5 justify-end" title={`${key}: ${total} signups, ${paid} paid`}>
                      <div style={{ height: `${(paid / maxSignups) * 100 * 1.28}%`, backgroundColor: '#f59e0b', borderRadius: '2px 2px 0 0', minHeight: paid > 0 ? 3 : 0 }} />
                      <div style={{ height: `${((total - paid) / maxSignups) * 100 * 1.28}%`, backgroundColor: '#404040', borderRadius: '2px 2px 0 0', minHeight: (total - paid) > 0 ? 3 : 0 }} />
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-2 mb-2">
                <span style={{ color: '#404040' }} className="text-xs">30d ago</span>
                <span style={{ color: '#404040' }} className="text-xs">today</span>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div style={{ backgroundColor: '#f59e0b', width: 10, height: 10, borderRadius: 2 }} />
                  <span style={{ color: '#737373' }} className="text-xs">Paid</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div style={{ backgroundColor: '#404040', width: 10, height: 10, borderRadius: 2 }} />
                  <span style={{ color: '#737373' }} className="text-xs">Free signups</span>
                </div>
              </div>
            </div>

            {/* Milestone retention */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5">
              <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Milestone Retention</h2>
              <p style={{ color: '#525252' }} className="text-xs mb-4">% of paid users who completed each milestone</p>
              <div className="space-y-4">
                {milestoneData.map((m) => (
                  <div key={m.day}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-white text-sm font-bold">Day {m.day}</span>
                      <span style={{ color: m.pct >= 50 ? '#86efac' : m.pct >= 25 ? '#fbbf24' : '#737373' }} className="text-sm font-black">
                        {m.pct}% <span style={{ color: '#525252' }} className="font-normal text-xs">({m.count} users)</span>
                      </span>
                    </div>
                    <div style={{ backgroundColor: '#1a1a1a', height: '8px', borderRadius: '9999px' }}>
                      <div
                        style={{
                          width: `${m.pct}%`,
                          height: '8px',
                          borderRadius: '9999px',
                          backgroundColor: m.pct >= 50 ? '#22c55e' : m.pct >= 25 ? '#f59e0b' : '#525252',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Completion funnel - all 30 days */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5 mb-5">
            <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Completion Funnel — All 30 Days</h2>
            <p style={{ color: '#525252' }} className="text-xs mb-4">Distinct users who completed each lesson</p>
            <div className="flex items-end gap-1 h-28">
              {funnelData.map((d) => (
                <div
                  key={d.day}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${Math.max((d.count / maxFunnelCount) * 100, 2)}%`,
                    backgroundColor: d.count > 0 ? `rgba(245,158,11,${0.3 + (d.count / maxFunnelCount) * 0.7})` : '#1a1a1a',
                  }}
                  title={`Day ${d.day}: ${d.count} users`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span style={{ color: '#404040' }} className="text-xs">Day 1</span>
              <span style={{ color: '#404040' }} className="text-xs">Day 30</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            {/* Practice stats */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5">
              <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Practice Stats</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Sessions', value: String(practiceSessions.length) },
                  { label: 'Total Time', value: `${Math.round(totalPracticeMin / 60)}h ${totalPracticeMin % 60}m` },
                  { label: 'Avg Session', value: `${avgSessionMin} min` },
                  { label: 'Avg per User', value: `${avgMinPerUser} min` },
                  { label: 'Active Students', value: String(uniquePractitioners) },
                  { label: 'Best Streak', value: `${maxStreak} days` },
                ].map((s) => (
                  <div key={s.label} style={{ backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a' }} className="rounded-lg p-3">
                    <p style={{ color: '#404040' }} className="text-xs mb-1">{s.label}</p>
                    <p className="text-white text-base font-black">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lesson ratings */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5">
              <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Lesson Ratings (avg per day)</h2>
              {dayRatings.length === 0 ? (
                <p style={{ color: '#525252' }} className="text-sm">No ratings yet.</p>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-60">
                  {dayRatings.slice(0, 15).map((d) => {
                    const avg = d._avg.rating ?? 0
                    return (
                      <div key={d.day} className="flex items-center gap-3">
                        <span style={{ color: '#737373', minWidth: '48px' }} className="text-xs">Day {d.day}</span>
                        <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: '#1a1a1a' }}>
                          <div
                            style={{
                              width: `${(avg / 5) * 100}%`,
                              height: '6px',
                              borderRadius: '9999px',
                              backgroundColor: avg >= 4 ? '#22c55e' : avg >= 3 ? '#f59e0b' : '#ef4444',
                            }}
                          />
                        </div>
                        <span style={{ color: '#f59e0b' }} className="text-xs w-8 text-right">{avg.toFixed(1)}★</span>
                        <span style={{ color: '#404040' }} className="text-xs w-6 text-right">({d._count._all})</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
