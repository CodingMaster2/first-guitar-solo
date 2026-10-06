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
    coachMessageCount,
    graduatedUsersRaw,
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
    prisma.coachMessage.count(),
    prisma.user.findMany({
      where: { purchaseStatus: 'PAID', profile: { currentDay: { gte: 30 } } },
      select: { id: true, name: true },
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

  // =============================================
  // NEW ANALYTICS COMPUTATIONS
  // =============================================

  // Paid user ID set
  const paidUserIds = new Set(allUsers.filter(u => u.purchaseStatus === 'PAID').map(u => u.id))

  // Per-user completed days set (paid users only) + timestamp lookup
  const userCompletedDays: Record<string, Set<number>> = {}
  const userDayCompletedAt: Record<string, Record<number, Date>> = {}
  for (const p of allCompleted) {
    if (!paidUserIds.has(p.userId)) continue
    if (!userCompletedDays[p.userId]) userCompletedDays[p.userId] = new Set()
    userCompletedDays[p.userId].add(p.day)
    if (p.completedAt) {
      if (!userDayCompletedAt[p.userId]) userDayCompletedAt[p.userId] = {}
      userDayCompletedAt[p.userId][p.day] = p.completedAt
    }
  }

  // === Drop-off Heatmap ===
  // Day 1: paid users who never completed day 1 and signed up > 7 days ago
  const dropoffData: Array<{ day: number; dropoffs: number }> = []
  let day1Dropoffs = 0
  for (const u of allUsers) {
    if (u.purchaseStatus !== 'PAID') continue
    const daysSinceSignup = (now.getTime() - u.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceSignup > 7 && !userCompletedDays[u.id]?.has(1)) {
      day1Dropoffs++
    }
  }
  dropoffData.push({ day: 1, dropoffs: day1Dropoffs })
  // Days 2-30: completed prevDay but not nextDay, and it has been > 7 days
  for (let nextDay = 2; nextDay <= 30; nextDay++) {
    const prevDay = nextDay - 1
    let dropoffs = 0
    for (const [userId, completedSet] of Object.entries(userCompletedDays)) {
      if (!completedSet.has(prevDay)) continue
      if (completedSet.has(nextDay)) continue
      const prevCompletedAt = userDayCompletedAt[userId]?.[prevDay]
      if (prevCompletedAt) {
        const daysSince = (now.getTime() - prevCompletedAt.getTime()) / (1000 * 60 * 60 * 24)
        if (daysSince > 7) dropoffs++
      } else {
        // No timestamp recorded — count as stalled
        dropoffs++
      }
    }
    dropoffData.push({ day: nextDay, dropoffs })
  }
  const maxDropoffs = Math.max(...dropoffData.map(d => d.dropoffs), 1)

  // === Session Time-of-Day ===
  const timeOfDay = { morning: 0, afternoon: 0, evening: 0, night: 0 }
  for (const s of practiceSessions) {
    const hour = new Date(s.createdAt).getHours()
    if (hour >= 6 && hour < 12) timeOfDay.morning++
    else if (hour >= 12 && hour < 18) timeOfDay.afternoon++
    else if (hour >= 18 && hour < 22) timeOfDay.evening++
    else timeOfDay.night++
  }
  const totalSessions = practiceSessions.length
  const dominantTime: string = (Object.entries(timeOfDay) as Array<[string, number]>)
    .sort((a, b) => b[1] - a[1])[0][0]

  // === Lesson Skip Analysis ===
  const skipCounts: Record<number, number> = {}
  for (const completedSet of Object.values(userCompletedDays)) {
    const completedDayArr = Array.from(completedSet).sort((a, b) => a - b)
    for (let i = 1; i < completedDayArr.length; i++) {
      const gap = completedDayArr[i] - completedDayArr[i - 1]
      if (gap > 1) {
        for (let d = completedDayArr[i - 1] + 1; d < completedDayArr[i]; d++) {
          skipCounts[d] = (skipCounts[d] ?? 0) + 1
        }
      }
    }
  }
  const topSkipped = Object.entries(skipCounts)
    .map(([day, count]) => ({ day: Number(day), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
  const maxSkipCount = Math.max(...topSkipped.map(s => s.count), 1)

  // === AI Cost Estimation ===
  const estimatedTokens = coachMessageCount * 300
  const estimatedCostUsd = (estimatedTokens / 1_000_000) * 0.05
  const avgCostPerUser = paidUsers > 0 ? estimatedCostUsd / paidUsers : 0

  // === Graduation Wall ===
  const day30CompletedAt: Record<string, Date> = {}
  for (const p of allCompleted) {
    if (p.day === 30 && p.completedAt) {
      day30CompletedAt[p.userId] = p.completedAt
    }
  }
  const graduatedCount = Object.keys(day30CompletedAt).length
  const graduatedDetails = graduatedUsersRaw
    .filter(u => !!day30CompletedAt[u.id])
    .map(u => ({ name: u.name, completedAt: day30CompletedAt[u.id]! }))
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
    .slice(0, 20)

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

          {/* ============================================= */}
          {/* NEW SECTIONS */}
          {/* ============================================= */}

          {/* Drop-off Heatmap */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5 mb-5">
            <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Drop-off Points</h2>
            <p style={{ color: '#525252' }} className="text-xs mb-4">Students who completed the previous day but stopped (stalled &gt;7 days)</p>
            <div className="flex items-end gap-0.5 h-28">
              {dropoffData.map((d) => {
                const ratio = d.dropoffs / maxDropoffs
                const color = ratio < 0.33 ? '#22c55e' : ratio < 0.66 ? '#f59e0b' : '#ef4444'
                return (
                  <div
                    key={d.day}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${d.dropoffs > 0 ? Math.max((d.dropoffs / maxDropoffs) * 100, 4) : 0}%`,
                      backgroundColor: d.dropoffs > 0 ? color : '#1a1a1a',
                    }}
                    title={`Day ${d.day}: ${d.dropoffs} dropout${d.dropoffs !== 1 ? 's' : ''}`}
                  />
                )
              })}
            </div>
            <div className="flex justify-between mt-2 mb-2">
              <span style={{ color: '#404040' }} className="text-xs">Day 1</span>
              <span style={{ color: '#404040' }} className="text-xs">Day 30</span>
            </div>
            <div className="flex gap-4">
              {([
                { color: '#22c55e', label: 'Low dropout' },
                { color: '#f59e0b', label: 'Medium' },
                { color: '#ef4444', label: 'High dropout' },
              ] as Array<{ color: string; label: string }>).map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div style={{ backgroundColor: l.color, width: 10, height: 10, borderRadius: 2 }} />
                  <span style={{ color: '#737373' }} className="text-xs">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Session Time-of-Day */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5 mb-5">
            <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">When Students Practice</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {(([
                { key: 'morning', label: 'Morning', hours: '6am–12pm', icon: 'AM' },
                { key: 'afternoon', label: 'Afternoon', hours: '12pm–6pm', icon: 'PM' },
                { key: 'evening', label: 'Evening', hours: '6pm–10pm', icon: 'EVE' },
                { key: 'night', label: 'Night', hours: '10pm–6am', icon: 'NITE' },
              ]) as Array<{ key: keyof typeof timeOfDay; label: string; hours: string; icon: string }>).map((t) => {
                const count = timeOfDay[t.key]
                const pct = totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0
                const isDominant = (t.key as string) === dominantTime
                return (
                  <div
                    key={t.key}
                    style={{
                      backgroundColor: '#0d0d0d',
                      border: `1px solid ${isDominant ? '#f59e0b' : '#1a1a1a'}`,
                    }}
                    className="rounded-lg p-4 text-center"
                  >
                    <p style={{ color: isDominant ? '#f59e0b' : '#404040', fontFamily: 'monospace' }} className="text-xs font-black mb-1">{t.icon}</p>
                    <p style={{ color: isDominant ? '#f59e0b' : '#737373' }} className="text-xs uppercase tracking-wider mb-1">{t.label}</p>
                    <p style={{ color: isDominant ? '#f59e0b' : '#ffffff' }} className="text-2xl font-black">{count}</p>
                    <p style={{ color: '#525252' }} className="text-xs mt-1">{pct}% · {t.hours}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            {/* Lesson Skip Analysis */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5">
              <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Lesson Skip Analysis</h2>
              <p style={{ color: '#525252' }} className="text-xs mb-4">Top days skipped (completed surrounding days but not this one)</p>
              {topSkipped.length === 0 ? (
                <p style={{ color: '#525252' }} className="text-sm">No skip data yet.</p>
              ) : (
                <div className="space-y-2">
                  {topSkipped.map((s) => (
                    <div key={s.day} className="flex items-center gap-3">
                      <span style={{ color: '#737373', minWidth: '48px' }} className="text-xs">Day {s.day}</span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: '#1a1a1a' }}>
                        <div
                          style={{
                            width: `${(s.count / maxSkipCount) * 100}%`,
                            height: '6px',
                            borderRadius: '9999px',
                            backgroundColor: '#f59e0b',
                          }}
                        />
                      </div>
                      <span style={{ color: '#f59e0b' }} className="text-xs w-14 text-right">{s.count} skip{s.count !== 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Cost Dashboard */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5">
              <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">AI Coach Cost Estimate</h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {([
                  { label: 'Total Messages', value: coachMessageCount.toLocaleString(), color: '#93c5fd' },
                  { label: 'Est. Tokens', value: estimatedTokens.toLocaleString(), color: '#c4b5fd' },
                  { label: 'Est. Total Cost', value: `$${estimatedCostUsd.toFixed(4)}`, color: '#f59e0b' },
                  { label: 'Avg per User', value: `$${avgCostPerUser.toFixed(5)}`, color: '#86efac' },
                ] as Array<{ label: string; value: string; color: string }>).map((s) => (
                  <div key={s.label} style={{ backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a' }} className="rounded-lg p-3">
                    <p style={{ color: '#404040' }} className="text-xs mb-1">{s.label}</p>
                    <p style={{ color: s.color }} className="text-lg font-black">{s.value}</p>
                  </div>
                ))}
              </div>
              <p style={{ color: '#404040' }} className="text-xs leading-relaxed">
                Estimate: avg 150 tokens/message &times; 2 (user+AI) = 300 tokens/exchange at $0.05/1M tokens (Groq llama3-8b)
              </p>
            </div>
          </div>

          {/* Graduation Wall */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5 mb-5">
            <div className="flex items-center gap-3 mb-4">
              <div style={{ color: '#f59e0b', fontSize: '1.75rem', lineHeight: 1 }}>&#127942;</div>
              <div>
                <h2 className="text-white font-bold text-xs uppercase tracking-wider">Graduation Wall</h2>
                <p style={{ color: '#f59e0b' }} className="text-xl font-black mt-0.5">
                  {graduatedCount} student{graduatedCount !== 1 ? 's' : ''} graduated
                </p>
              </div>
            </div>
            {graduatedDetails.length === 0 ? (
              <p style={{ color: '#525252' }} className="text-sm">No graduates yet — they&apos;re on their way!</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {graduatedDetails.map((g, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: '#0d0d0d', border: '1px solid #2a1f00' }}
                    className="rounded-lg p-3 flex items-center gap-2"
                  >
                    <span style={{ color: '#f59e0b' }} className="text-base">&#9733;</span>
                    <div>
                      <p className="text-white text-xs font-bold">{g.name ?? 'Anonymous'}</p>
                      <p style={{ color: '#525252' }} className="text-xs">{g.completedAt.toLocaleDateString()}</p>
                    </div>
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
