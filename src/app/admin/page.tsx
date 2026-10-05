import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }} className="flex items-center justify-center">
        <p style={{ color: '#fca5a5' }}>Access denied.</p>
      </div>
    )
  }

  const now = new Date()
  const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(now.getDate() - 7)
  const oneDayAgo = new Date(now); oneDayAgo.setDate(now.getDate() - 1)
  const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30)

  const [
    totalUsers,
    paidUsers,
    active7d,
    activeToday,
    allCompleted,
    recentSignups,
    recentCoachMessages,
    hardDays,
    practiceAgg,
    churnRisk,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { purchaseStatus: 'PAID' } }),
    prisma.practiceSession.groupBy({ by: ['userId'], where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.practiceSession.groupBy({ by: ['userId'], where: { createdAt: { gte: oneDayAgo } } }),
    prisma.progress.findMany({ where: { completed: true }, select: { userId: true, day: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 12,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        purchaseStatus: true,
        profile: { select: { currentDay: true, totalXP: true, streak: true } },
      },
    }),
    prisma.coachMessage.findMany({
      where: { role: 'user' },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { user: { select: { id: true, email: true } } },
    }),
    prisma.progress.groupBy({
      by: ['day'],
      where: { difficulty: 'hard' },
      _count: { _all: true },
      orderBy: { _count: { day: 'desc' } },
      take: 5,
    }),
    prisma.practiceSession.aggregate({ _sum: { duration: true }, _count: { _all: true } }),
    prisma.profile.count({
      where: {
        user: { purchaseStatus: 'PAID' },
        OR: [{ lastPracticeDate: null }, { lastPracticeDate: { lt: sevenDaysAgo } }],
      },
    }),
  ])

  const revenue = paidUsers * 25
  const conversion = totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 100) : 0

  const userCompletionMap = new Map<string, Set<number>>()
  for (const p of allCompleted) {
    if (!userCompletionMap.has(p.userId)) userCompletionMap.set(p.userId, new Set())
    userCompletionMap.get(p.userId)!.add(p.day)
  }
  const completionPcts = Array.from(userCompletionMap.values()).map((d) => (d.size / 30) * 100)
  const avgCompletion = completionPcts.length > 0
    ? Math.round(completionPcts.reduce((a, b) => a + b, 0) / completionPcts.length)
    : 0

  const dayCompletionCounts: Record<number, number> = {}
  for (const p of allCompleted) {
    dayCompletionCounts[p.day] = (dayCompletionCounts[p.day] ?? 0) + 1
  }

  const totalPracticeMin = practiceAgg._sum.duration ?? 0
  const totalSessions = practiceAgg._count._all

  // Signups in last 30 days grouped by day
  const signupsByDay: Record<string, number> = {}
  const recentAllSignups = await prisma.user.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
  })
  for (const u of recentAllSignups) {
    const key = u.createdAt.toISOString().slice(0, 10)
    signupsByDay[key] = (signupsByDay[key] ?? 0) + 1
  }
  const maxSignupsDay = Math.max(...Object.values(signupsByDay), 1)

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h1 className="text-2xl font-black text-white uppercase">Overview</h1>
              <p style={{ color: '#525252' }} className="text-xs mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Primary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Revenue', value: `$${revenue.toLocaleString()}`, sub: `${paidUsers} paid × $25`, color: '#f59e0b', bg: '#1a1200' },
              { label: 'Paid Users', value: String(paidUsers), sub: `${conversion}% conversion`, color: '#86efac', bg: '#052e16' },
              { label: 'Active (7d)', value: String(active7d.length), sub: `${activeToday.length} active today`, color: '#93c5fd', bg: '#0c1a3a' },
              { label: 'Churn Risk', value: String(churnRisk), sub: 'paid, no practice 7d', color: '#fca5a5', bg: '#1a0000' },
            ].map((s) => (
              <div key={s.label} style={{ backgroundColor: s.bg, border: `1px solid ${s.color}22` }} className="rounded-xl p-4">
                <p style={{ color: '#737373' }} className="text-xs uppercase tracking-wider mb-1">{s.label}</p>
                <p style={{ color: s.color }} className="text-3xl font-black">{s.value}</p>
                <p style={{ color: '#525252' }} className="text-xs mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Secondary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
            {[
              { label: 'Total Users', value: String(totalUsers), sub: 'all time signups' },
              { label: 'Avg Completion', value: `${avgCompletion}%`, sub: 'across active users' },
              { label: 'Total Practice', value: `${Math.round(totalPracticeMin / 60)}h`, sub: `${totalSessions} sessions` },
              { label: 'Days Completed', value: String(allCompleted.length), sub: 'total lesson completions' },
            ].map((s) => (
              <div key={s.label} style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-4">
                <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-white text-2xl font-black">{s.value}</p>
                <p style={{ color: '#404040' }} className="text-xs mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            {/* Signup chart - last 30 days */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5">
              <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Signups — Last 30 Days</h2>
              <div className="flex items-end gap-1 h-24">
                {Array.from({ length: 30 }, (_, i) => {
                  const d = new Date(now)
                  d.setDate(now.getDate() - (29 - i))
                  const key = d.toISOString().slice(0, 10)
                  const count = signupsByDay[key] ?? 0
                  const pct = (count / maxSignupsDay) * 100
                  return (
                    <div
                      key={key}
                      className="flex-1 rounded-sm transition-all"
                      style={{ height: `${Math.max(pct, 4)}%`, backgroundColor: count > 0 ? '#f59e0b' : '#1f1f1f', opacity: count > 0 ? 0.7 + (pct / 100) * 0.3 : 1 }}
                      title={`${key}: ${count} signup${count !== 1 ? 's' : ''}`}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between mt-2">
                <span style={{ color: '#404040' }} className="text-xs">30d ago</span>
                <span style={{ color: '#404040' }} className="text-xs">today</span>
              </div>
            </div>

            {/* Hardest days */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5">
              <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Hardest Lessons (reported)</h2>
              {hardDays.length === 0 ? (
                <p style={{ color: '#525252' }} className="text-sm">No difficulty data yet.</p>
              ) : (
                <div className="space-y-3">
                  {hardDays.map((d) => (
                    <div key={d.day} className="flex items-center gap-3">
                      <span style={{ color: '#737373', minWidth: '64px' }} className="text-xs">Day {d.day}</span>
                      <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: '#1f1f1f' }}>
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(d._count._all / (hardDays[0]?._count._all ?? 1)) * 100}%`,
                            backgroundColor: '#ef4444',
                          }}
                        />
                      </div>
                      <span style={{ color: '#fca5a5' }} className="text-xs w-6 text-right">{d._count._all}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            {/* Recent signups */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-bold text-xs uppercase tracking-wider">Recent Signups</h2>
                <Link href="/admin/users" style={{ color: '#f59e0b' }} className="text-xs hover:underline">View all →</Link>
              </div>
              <div className="space-y-0.5">
                {recentSignups.map((user) => (
                  <Link
                    key={user.id}
                    href={`/admin/users/${user.id}`}
                    style={{ borderBottom: '1px solid #1a1a1a' }}
                    className="py-2.5 flex justify-between items-center hover:bg-neutral-900 px-2 -mx-2 rounded transition-colors block"
                  >
                    <div>
                      <p className="text-white text-xs font-medium">{user.email}</p>
                      <p style={{ color: '#525252' }} className="text-xs">{new Date(user.createdAt).toLocaleDateString()} · {user.name ?? 'No name'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {user.profile && (
                        <span style={{ color: '#f59e0b' }} className="text-xs">{user.profile.totalXP} XP</span>
                      )}
                      <span
                        style={{
                          backgroundColor: user.purchaseStatus === 'PAID' ? '#052e16' : '#1a1a1a',
                          color: user.purchaseStatus === 'PAID' ? '#86efac' : '#525252',
                          border: `1px solid ${user.purchaseStatus === 'PAID' ? '#166534' : '#262626'}`,
                        }}
                        className="text-xs px-2 py-0.5 rounded"
                      >
                        {user.purchaseStatus}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent coach questions */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-bold text-xs uppercase tracking-wider">Recent Coach Questions</h2>
                <Link href="/admin/coach" style={{ color: '#f59e0b' }} className="text-xs hover:underline">View all →</Link>
              </div>
              <div className="space-y-0.5">
                {recentCoachMessages.map((msg, i) => (
                  <Link
                    key={i}
                    href={`/admin/users/${msg.user.id}`}
                    style={{ borderBottom: '1px solid #1a1a1a' }}
                    className="py-2.5 hover:bg-neutral-900 px-2 -mx-2 rounded transition-colors block"
                  >
                    <p style={{ color: '#737373' }} className="text-xs mb-0.5">{msg.user.email}</p>
                    <p className="text-white text-xs line-clamp-2">{msg.content}</p>
                    <p style={{ color: '#404040' }} className="text-xs mt-0.5">{new Date(msg.createdAt).toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Lesson completion heatmap */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5">
            <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Lesson Completion Heatmap</h2>
            <div className="grid grid-cols-10 gap-1.5">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const count = dayCompletionCounts[day] ?? 0
                const maxCount = Math.max(...Object.values(dayCompletionCounts), 1)
                const opacity = count === 0 ? 0.08 : 0.2 + (count / maxCount) * 0.8
                return (
                  <div
                    key={day}
                    title={`Day ${day}: ${count} completion${count !== 1 ? 's' : ''}`}
                    style={{
                      backgroundColor: `rgba(245, 158, 11, ${opacity})`,
                      border: count > 0 ? '1px solid rgba(245,158,11,0.2)' : '1px solid #1a1a1a',
                      aspectRatio: '1',
                    }}
                    className="rounded-lg flex flex-col items-center justify-center gap-0.5"
                  >
                    <span style={{ color: count > 0 ? 'rgba(0,0,0,0.8)' : '#404040', fontSize: '0.6rem', fontWeight: 700 }}>{day}</span>
                    {count > 0 && <span style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.5rem' }}>{count}</span>}
                  </div>
                )
              })}
            </div>
            <p style={{ color: '#404040' }} className="text-xs mt-3">Darker = more users completed · Number inside = completion count</p>
          </div>
        </main>
      </div>
    </div>
  )
}
