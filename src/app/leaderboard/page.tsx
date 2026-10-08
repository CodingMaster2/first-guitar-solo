import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leaderboard — First Guitar Solo',
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function MedalOrRank({ rank }: { rank: number }) {
  if (rank === 1) return <span style={{ fontSize: '1.1rem' }}>🥇</span>
  if (rank === 2) return <span style={{ fontSize: '1.1rem' }}>🥈</span>
  if (rank === 3) return <span style={{ fontSize: '1.1rem' }}>🥉</span>
  return <span style={{ color: '#525252', fontWeight: 700, fontSize: '0.8rem', minWidth: 20 }}>{rank}</span>
}

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const [topXp, topStreak, graduates] = await Promise.all([
    prisma.profile.findMany({
      where: { leaderboardOptIn: true },
      orderBy: { totalXP: 'desc' },
      take: 20,
      include: { user: { select: { name: true, id: true } } },
    }),
    prisma.profile.findMany({
      where: { leaderboardOptIn: true, streak: { gt: 0 } },
      orderBy: { streak: 'desc' },
      take: 10,
      include: { user: { select: { name: true, id: true } } },
    }),
    prisma.profile.findMany({
      where: { soloCompleted: true },
      orderBy: { soloCompletedAt: 'desc' },
      take: 10,
      include: { user: { select: { name: true, id: true } } },
    }),
  ])

  const currentUserId = session.user.id

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 900, lineHeight: 1.1 }}>
            🏆 Leaderboard
          </h1>
          <p style={{ color: '#525252', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Opt in from your{' '}
            <Link href="/settings" style={{ color: '#f59e0b', textDecoration: 'none' }}>
              Settings
            </Link>{' '}
            to appear on the leaderboard.
          </p>
        </div>

        {/* Three-column grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}
          className="lg:grid-cols-3 md:grid-cols-2 grid-cols-1"
        >
          {/* XP Champions */}
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              gridColumn: 'span 1',
            }}
          >
            <h2 style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🏆 XP Champions
            </h2>

            {topXp.length === 0 ? (
              <p style={{ color: '#525252', fontSize: '0.8rem' }}>No one has opted in yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {topXp.map((profile, i) => {
                  const isMe = profile.user.id === currentUserId
                  return (
                    <div
                      key={profile.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.5rem 0.625rem',
                        borderRadius: '0.5rem',
                        backgroundColor: isMe ? 'rgba(245,158,11,0.1)' : 'transparent',
                        border: isMe ? '1px solid rgba(245,158,11,0.25)' : '1px solid transparent',
                      }}
                    >
                      <MedalOrRank rank={i + 1} />
                      <span
                        style={{
                          color: isMe ? '#f59e0b' : '#d4d4d4',
                          fontSize: '0.8rem',
                          fontWeight: isMe ? 700 : 400,
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {profile.user.name ?? 'Anonymous'}
                        {isMe && <span style={{ color: '#f59e0b', fontSize: '0.7rem', marginLeft: 4 }}>you</span>}
                      </span>
                      <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {profile.totalXP.toLocaleString()} XP
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Streak Masters */}
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderRadius: '0.75rem',
              padding: '1.5rem',
            }}
          >
            <h2 style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              🔥 Streak Masters
            </h2>

            {topStreak.length === 0 ? (
              <p style={{ color: '#525252', fontSize: '0.8rem' }}>No active streaks yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {topStreak.map((profile, i) => {
                  const isMe = profile.user.id === currentUserId
                  // Flame color: top 3 get warm colors, rest get dimmer
                  const flameColor = i === 0 ? '#ff4500' : i === 1 ? '#ff6b35' : i === 2 ? '#ff8c00' : '#d97706'
                  return (
                    <div
                      key={profile.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.5rem 0.625rem',
                        borderRadius: '0.5rem',
                        backgroundColor: isMe ? 'rgba(245,158,11,0.1)' : 'transparent',
                        border: isMe ? '1px solid rgba(245,158,11,0.25)' : '1px solid transparent',
                      }}
                    >
                      <MedalOrRank rank={i + 1} />
                      <span
                        style={{
                          color: isMe ? '#f59e0b' : '#d4d4d4',
                          fontSize: '0.8rem',
                          fontWeight: isMe ? 700 : 400,
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {profile.user.name ?? 'Anonymous'}
                        {isMe && <span style={{ color: '#f59e0b', fontSize: '0.7rem', marginLeft: 4 }}>you</span>}
                      </span>
                      <span style={{ color: flameColor, fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        🔥 {profile.streak}d
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent Graduates */}
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderRadius: '0.75rem',
              padding: '1.5rem',
            }}
          >
            <h2 style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              🎸 Recent Graduates
            </h2>

            {graduates.length === 0 ? (
              <p style={{ color: '#525252', fontSize: '0.8rem' }}>No graduates yet — be the first!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {graduates.map((profile, i) => {
                  const isMe = profile.user.id === currentUserId
                  return (
                    <div
                      key={profile.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.5rem 0.625rem',
                        borderRadius: '0.5rem',
                        backgroundColor: isMe ? 'rgba(245,158,11,0.1)' : 'transparent',
                        border: isMe ? '1px solid rgba(245,158,11,0.25)' : '1px solid transparent',
                      }}
                    >
                      <span style={{ color: '#525252', fontWeight: 700, fontSize: '0.8rem', minWidth: 20 }}>{i + 1}</span>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <p
                          style={{
                            color: isMe ? '#f59e0b' : '#d4d4d4',
                            fontSize: '0.8rem',
                            fontWeight: isMe ? 700 : 400,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            margin: 0,
                          }}
                        >
                          {profile.user.name ?? 'Anonymous'}
                          {isMe && <span style={{ color: '#f59e0b', fontSize: '0.7rem', marginLeft: 4 }}>you</span>}
                        </p>
                        <p style={{ color: '#525252', fontSize: '0.7rem', margin: 0 }}>
                          {formatDate(profile.soloCompletedAt)}
                        </p>
                      </div>
                      <span style={{ fontSize: '1rem' }}>🎓</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
