import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import AdminUserActions from './AdminUserActions'
import AdminNotesPanel from './AdminNotesPanel'

interface PageProps { params: Promise<{ id: string }> }

export default async function AdminUserDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      progress: { orderBy: { day: 'asc' } },
      practiceSessions: { orderBy: { createdAt: 'desc' }, take: 20 },
      userAchievements: { include: { achievement: true }, orderBy: { unlockedAt: 'desc' } },
      coachMessages: { orderBy: { createdAt: 'desc' }, take: 30 },
      feedback: { orderBy: { createdAt: 'desc' } },
      // adminNotes and tags are scalar fields included via full model
    },
  })

  if (!user) notFound()

  const completedDays = new Set(user.progress.filter((p) => p.completed).map((p) => p.day))
  const completionPct = Math.round((completedDays.size / 30) * 100)
  const totalPracticeMin = user.practiceSessions.reduce((s, p) => s + p.duration, 0)
  const daysSinceActive = user.profile?.lastPracticeDate
    ? Math.floor((Date.now() - new Date(user.profile.lastPracticeDate).getTime()) / 86400000)
    : null

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link href="/admin/users" style={{ color: '#525252' }} className="text-xs hover:text-white transition-colors">Users</Link>
            <span style={{ color: '#404040' }} className="text-xs">›</span>
            <span style={{ color: '#a3a3a3' }} className="text-xs">{user.email}</span>
          </div>

          {/* Header */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-6 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-xl font-black text-white">{user.name ?? 'No name'}</h1>
                  <span
                    style={{
                      backgroundColor: user.purchaseStatus === 'PAID' ? '#052e16' : '#1a1a1a',
                      color: user.purchaseStatus === 'PAID' ? '#86efac' : '#525252',
                      border: `1px solid ${user.purchaseStatus === 'PAID' ? '#166534' : '#262626'}`,
                    }}
                    className="text-xs px-2 py-0.5 rounded font-bold"
                  >
                    {user.purchaseStatus}
                  </span>
                  {user.role === 'ADMIN' && (
                    <span style={{ color: '#f59e0b' }} className="text-xs font-black uppercase">ADMIN</span>
                  )}
                </div>
                <p style={{ color: '#737373' }} className="text-sm">{user.email}</p>
                <p style={{ color: '#404040' }} className="text-xs mt-1">Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · ID: {user.id}</p>
              </div>
              <div className="text-right">
                {daysSinceActive === null ? (
                  <p style={{ color: '#404040' }} className="text-sm">Never practiced</p>
                ) : daysSinceActive === 0 ? (
                  <p style={{ color: '#86efac' }} className="text-sm font-bold">Active today</p>
                ) : (
                  <p style={{ color: daysSinceActive <= 3 ? '#fbbf24' : '#ef4444' }} className="text-sm">Last active {daysSinceActive}d ago</p>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
              {[
                { label: 'Current Day', value: String(user.profile?.currentDay ?? 1) },
                { label: 'Total XP', value: String(user.profile?.totalXP ?? 0), color: '#f59e0b' },
                { label: 'Streak', value: `${user.profile?.streak ?? 0}d` },
                { label: 'Best Streak', value: `${user.profile?.bestStreak ?? 0}d` },
                { label: 'Completion', value: `${completionPct}%` },
                { label: 'Practice Time', value: `${totalPracticeMin}m` },
              ].map((s) => (
                <div key={s.label} style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a' }} className="rounded-lg p-3 text-center">
                  <p style={{ color: '#404040' }} className="text-xs mb-1">{s.label}</p>
                  <p style={{ color: s.color ?? '#ffffff' }} className="text-base font-black">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div>
              <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-2">Actions</p>
              <AdminUserActions
                userId={user.id}
                isPaid={user.purchaseStatus === 'PAID'}
                streakFreezes={user.profile?.streakFreezes ?? 0}
                isSelf={user.id === session.user.id}
              />
            </div>

            {/* Admin Notes & Tags */}
            <div style={{ borderTop: '1px solid #1f1f1f' }} className="pt-4 mt-2">
              <AdminNotesPanel
                userId={user.id}
                initialNotes={user.adminNotes ?? null}
                initialTags={user.tags ?? null}
              />
            </div>
          </div>

          {/* Progress grid */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5 mb-5">
            <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">30-Day Progress</h2>
            <div className="grid grid-cols-10 gap-1.5">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const isDone = completedDays.has(day)
                const prog = user.progress.find((p) => p.day === day)
                return (
                  <div
                    key={day}
                    title={`Day ${day}${prog ? ` · ${prog.difficulty ?? ''} ${prog.rating ? `· ★${prog.rating}` : ''}` : ''}`}
                    style={{
                      backgroundColor: isDone ? '#1a1200' : '#161616',
                      border: isDone ? '1px solid #d97706' : '1px solid #1a1a1a',
                      aspectRatio: '1',
                    }}
                    className="rounded-lg flex flex-col items-center justify-center gap-0.5"
                  >
                    <span style={{ color: isDone ? '#f59e0b' : '#404040', fontSize: '0.6rem', fontWeight: 700 }}>
                      {isDone ? '✓' : day}
                    </span>
                    {prog?.rating && (
                      <span style={{ fontSize: '0.45rem', color: '#d97706' }}>{'★'.repeat(prog.rating)}</span>
                    )}
                  </div>
                )
              })}
            </div>
            <p style={{ color: '#404040' }} className="text-xs mt-3">Hover for difficulty + rating · {completedDays.size}/30 complete</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            {/* Practice sessions */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5">
              <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Practice Sessions ({user.practiceSessions.length})</h2>
              {user.practiceSessions.length === 0 ? (
                <p style={{ color: '#525252' }} className="text-sm">None yet.</p>
              ) : (
                <div className="space-y-0 overflow-y-auto max-h-64">
                  {user.practiceSessions.map((s) => (
                    <div key={s.id} style={{ borderBottom: '1px solid #161616' }} className="py-2 flex justify-between">
                      <div>
                        <span className="text-white text-xs">Day {s.day}</span>
                        {s.difficulty && <span style={{ color: '#525252' }} className="text-xs"> · {s.difficulty}</span>}
                      </div>
                      <div className="text-right">
                        <span style={{ color: '#f59e0b' }} className="text-xs">{s.duration} min</span>
                        <span style={{ color: '#404040' }} className="text-xs block">{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Achievements */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5">
              <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Achievements ({user.userAchievements.length})</h2>
              {user.userAchievements.length === 0 ? (
                <p style={{ color: '#525252' }} className="text-sm">None yet.</p>
              ) : (
                <div className="space-y-0 overflow-y-auto max-h-64">
                  {user.userAchievements.map((ua) => (
                    <div key={ua.id} style={{ borderBottom: '1px solid #161616' }} className="py-2 flex justify-between items-center">
                      <div>
                        <p className="text-white text-xs font-medium">{ua.achievement.name}</p>
                        <p style={{ color: '#525252' }} className="text-xs">{ua.achievement.description}</p>
                      </div>
                      <div className="text-right">
                        <p style={{ color: '#f59e0b' }} className="text-xs">+{ua.achievement.xpReward} XP</p>
                        <p style={{ color: '#404040' }} className="text-xs">{new Date(ua.unlockedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coach messages */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5 mb-5">
            <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Coach Conversation (last 30 messages)</h2>
            {user.coachMessages.length === 0 ? (
              <p style={{ color: '#525252' }} className="text-sm">No messages.</p>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-80">
                {[...user.coachMessages].reverse().map((msg) => (
                  <div
                    key={msg.id}
                    className="flex"
                    style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                  >
                    <div
                      style={{
                        backgroundColor: msg.role === 'user' ? '#1a1200' : '#161616',
                        border: `1px solid ${msg.role === 'user' ? '#d97706' : '#1f1f1f'}`,
                        maxWidth: '80%',
                      }}
                      className="px-3 py-2 rounded-xl"
                    >
                      <p style={{ color: msg.role === 'user' ? '#fde68a' : '#d4d4d4' }} className="text-xs">{msg.content}</p>
                      <p style={{ color: '#404040' }} className="text-xs mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback */}
          {user.feedback.length > 0 && (
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5">
              <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Feedback ({user.feedback.length})</h2>
              <div className="space-y-2">
                {user.feedback.map((f) => (
                  <div key={f.id} style={{ borderBottom: '1px solid #161616' }} className="py-2 flex justify-between items-start gap-4">
                    <div className="flex-1">
                      {f.comment && <p style={{ color: '#d4d4d4' }} className="text-xs">{f.comment}</p>}
                      {f.type && <p style={{ color: '#525252' }} className="text-xs mt-0.5">{f.type}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {f.day && <p style={{ color: '#737373' }} className="text-xs">Day {f.day}</p>}
                      {f.rating && (
                        <p style={{ color: '#f59e0b' }} className="text-xs">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</p>
                      )}
                      <p style={{ color: '#404040' }} className="text-xs">{new Date(f.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
