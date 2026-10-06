import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Leaderboard — First Guitar Solo' }

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const [topXP, topStreak] = await Promise.all([
    prisma.profile.findMany({
      where: { leaderboardOptIn: true },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { totalXP: 'desc' },
      take: 50,
    }),
    prisma.profile.findMany({
      where: { leaderboardOptIn: true, streak: { gt: 0 } },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { streak: 'desc' },
      take: 10,
    }),
  ])

  const currentUserId = session.user.id

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase text-white">
              <span style={{ color: '#f59e0b' }}>Top</span> Students
            </h1>
            <p style={{ color: '#a3a3a3' }} className="text-sm mt-1">
              Rankings for students who opted in to the leaderboard.
            </p>
          </div>
          <Link
            href="/settings"
            style={{ border: '1px solid #f59e0b', color: '#f59e0b' }}
            className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-amber-950 transition-colors"
          >
            {topXP.some(p => p.user.id === currentUserId) ? 'Manage Leaderboard' : 'Join Leaderboard'}
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main XP table */}
          <div className="lg:col-span-2">
            <div
              style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
              className="rounded-xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b" style={{ borderColor: '#1f1f1f' }}>
                <h2 className="text-white font-bold text-sm uppercase tracking-wider">Top 50 by XP</h2>
              </div>
              {topXP.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p style={{ color: '#f59e0b' }} className="text-2xl mb-2">🎸</p>
                  <p style={{ color: '#a3a3a3' }} className="text-sm">No one on the leaderboard yet.</p>
                  <p style={{ color: '#525252' }} className="text-xs mt-1">
                    Be the first —{' '}
                    <Link href="/settings" style={{ color: '#f59e0b' }} className="hover:underline">
                      opt in from Settings
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <div>
                  {/* Header row */}
                  <div
                    className="grid px-5 py-2 text-xs uppercase tracking-wider"
                    style={{
                      gridTemplateColumns: '40px 1fr 80px 60px 80px',
                      color: '#525252',
                      borderBottom: '1px solid #1f1f1f',
                    }}
                  >
                    <span>#</span>
                    <span>Student</span>
                    <span className="text-right">XP</span>
                    <span className="text-right">Streak</span>
                    <span className="text-right">Days</span>
                  </div>
                  {topXP.map((profile, i) => {
                    const isMe = profile.user.id === currentUserId
                    return (
                      <div
                        key={profile.id}
                        className="grid px-5 py-3 items-center transition-colors hover:opacity-90"
                        style={{
                          gridTemplateColumns: '40px 1fr 80px 60px 80px',
                          borderBottom: '1px solid #1a1a1a',
                          backgroundColor: isMe ? 'rgba(245,158,11,0.07)' : undefined,
                          borderLeft: isMe ? '2px solid #f59e0b' : undefined,
                        }}
                      >
                        {/* Rank */}
                        <span
                          style={{
                            color: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#b45309' : '#404040',
                            fontWeight: i < 3 ? 900 : 400,
                          }}
                          className="text-sm"
                        >
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                        </span>

                        {/* Name + avatar */}
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              backgroundColor: isMe ? '#78350f' : '#1a1a1a',
                              border: isMe ? '1px solid #f59e0b' : '1px solid #262626',
                              flexShrink: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{ color: isMe ? '#f59e0b' : '#525252', fontSize: '0.7rem' }}>
                              {(profile.user.name ?? 'A').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span
                            style={{ color: isMe ? '#f59e0b' : '#d4d4d4' }}
                            className="text-sm font-medium truncate"
                          >
                            {profile.user.name ?? 'Anonymous'}{isMe ? ' (you)' : ''}
                          </span>
                        </div>

                        {/* XP */}
                        <span
                          style={{ color: '#f59e0b', fontWeight: 700 }}
                          className="text-sm text-right"
                        >
                          {profile.totalXP.toLocaleString()}
                        </span>

                        {/* Streak */}
                        <span style={{ color: '#a3a3a3' }} className="text-sm text-right">
                          {profile.streak > 0 ? `${profile.streak}🔥` : '—'}
                        </span>

                        {/* Days completed (currentDay - 1 as proxy) */}
                        <span style={{ color: '#a3a3a3' }} className="text-sm text-right">
                          {Math.max(0, profile.currentDay - 1)}/30
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Streak sidebar */}
          <div>
            <div
              style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
              className="rounded-xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b" style={{ borderColor: '#1f1f1f' }}>
                <h2 className="text-white font-bold text-sm uppercase tracking-wider">🔥 Top Streaks</h2>
              </div>
              {topStreak.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p style={{ color: '#525252' }} className="text-xs">No active streaks yet.</p>
                </div>
              ) : (
                <div>
                  {topStreak.map((profile, i) => {
                    const isMe = profile.user.id === currentUserId
                    return (
                      <div
                        key={profile.id}
                        className="px-5 py-3 flex items-center justify-between"
                        style={{
                          borderBottom: '1px solid #1a1a1a',
                          backgroundColor: isMe ? 'rgba(245,158,11,0.07)' : undefined,
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span style={{ color: '#525252', fontSize: '0.7rem', width: 16 }}>
                            {i + 1}
                          </span>
                          <span
                            style={{ color: isMe ? '#f59e0b' : '#d4d4d4' }}
                            className="text-sm truncate"
                          >
                            {profile.user.name ?? 'Anonymous'}{isMe ? ' (you)' : ''}
                          </span>
                        </div>
                        <span style={{ color: '#f59e0b', fontWeight: 700 }} className="text-sm ml-2 flex-shrink-0">
                          {profile.streak}d 🔥
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* CTA */}
            <div
              style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
              className="rounded-xl p-5 mt-4"
            >
              <p style={{ color: '#a3a3a3' }} className="text-xs leading-relaxed mb-3">
                Rankings are opt-in. Enable leaderboard visibility in your settings to appear here.
              </p>
              <Link
                href="/settings"
                style={{ color: '#f59e0b' }}
                className="text-xs font-bold hover:underline"
              >
                Go to Settings →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
