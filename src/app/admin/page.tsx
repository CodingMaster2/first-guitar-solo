import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }} className="flex items-center justify-center">
        <p style={{ color: '#fca5a5' }}>Access denied. Admin only.</p>
      </div>
    )
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [totalUsers, paidUsers, recentPractice, allProgress, recentSignups, recentMessages] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { purchaseStatus: 'PAID' } }),
    prisma.practiceSession.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { userId: true },
    }),
    prisma.progress.findMany({ where: { completed: true }, select: { userId: true, day: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, email: true, name: true, createdAt: true, purchaseStatus: true, profile: { select: { currentDay: true } } },
    }),
    prisma.coachMessage.findMany({
      where: { role: 'user' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { content: true, createdAt: true, userId: true },
    }),
  ])

  const activeUserIds = new Set(recentPractice.map((p) => p.userId))
  const activeUsers = activeUserIds.size

  const userCompletionMap = new Map<string, Set<number>>()
  for (const p of allProgress) {
    if (!userCompletionMap.has(p.userId)) userCompletionMap.set(p.userId, new Set())
    userCompletionMap.get(p.userId)!.add(p.day)
  }
  const completionPercentages = Array.from(userCompletionMap.values()).map((days) => (days.size / 30) * 100)
  const avgCompletion = completionPercentages.length > 0
    ? Math.round(completionPercentages.reduce((a, b) => a + b, 0) / completionPercentages.length)
    : 0

  const dayCompletionCounts: Record<number, number> = {}
  for (const p of allProgress) {
    dayCompletionCounts[p.day] = (dayCompletionCounts[p.day] ?? 0) + 1
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-black text-white uppercase mb-6">Admin Overview</h1>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: totalUsers, color: '#ffffff' },
              { label: 'Paid Users', value: paidUsers, color: '#f59e0b' },
              { label: 'Active (7d)', value: activeUsers, color: '#22c55e' },
              { label: 'Avg Completion', value: `${avgCompletion}%`, color: '#0ea5e9' },
            ].map((stat) => (
              <div key={stat.label} style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-lg p-4">
                <p style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider mb-1">{stat.label}</p>
                <p style={{ color: stat.color }} className="text-3xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent signups */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5">
              <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Recent Signups</h2>
              <div className="space-y-2">
                {recentSignups.map((user) => (
                  <div key={user.id} style={{ borderBottom: '1px solid #1a1a1a' }} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="text-white text-sm">{user.email}</p>
                      <p style={{ color: '#a3a3a3' }} className="text-xs">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span
                        style={{
                          backgroundColor: user.purchaseStatus === 'PAID' ? '#052e16' : '#1a1a1a',
                          color: user.purchaseStatus === 'PAID' ? '#86efac' : '#a3a3a3',
                          border: `1px solid ${user.purchaseStatus === 'PAID' ? '#166534' : '#262626'}`,
                        }}
                        className="text-xs px-2 py-0.5 rounded"
                      >
                        {user.purchaseStatus}
                      </span>
                      {user.profile && (
                        <p style={{ color: '#a3a3a3' }} className="text-xs mt-1">Day {user.profile.currentDay}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent coach messages */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5">
              <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Recent Coach Messages</h2>
              <div className="space-y-2">
                {recentMessages.map((msg, i) => (
                  <div key={i} style={{ borderBottom: '1px solid #1a1a1a' }} className="py-2">
                    <p style={{ color: '#a3a3a3' }} className="text-xs truncate">{msg.content}</p>
                    <p style={{ color: '#404040' }} className="text-xs mt-0.5">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Day completion rates */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5 mt-6">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Lesson Completion Rates</h2>
            <div className="grid grid-cols-10 sm:grid-cols-15 gap-1">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const count = dayCompletionCounts[day] ?? 0
                const maxCount = Math.max(...Object.values(dayCompletionCounts), 1)
                const opacity = count === 0 ? 0.1 : 0.2 + (count / maxCount) * 0.8
                return (
                  <div
                    key={day}
                    title={`Day ${day}: ${count} completions`}
                    style={{ backgroundColor: `rgba(245, 158, 11, ${opacity})`, aspectRatio: '1' }}
                    className="rounded text-xs flex items-center justify-center text-black font-bold"
                  >
                    {day}
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
