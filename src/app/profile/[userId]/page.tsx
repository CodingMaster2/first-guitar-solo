import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ userId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  })
  if (!user) return { title: 'Profile Not Found — First Guitar Solo' }
  return {
    title: `${user.name ?? 'Guitarist'} — First Guitar Solo`,
    description: `${user.name ?? 'A student'} is learning lead guitar on First Guitar Solo.`,
  }
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function achievementIcon(key: string): string {
  if (key.includes('streak')) return '🔥'
  if (key.includes('graduate') || key.includes('solo')) return '🎸'
  if (key.includes('perfect')) return '⭐'
  if (key.includes('speed') || key.includes('fast')) return '⚡'
  if (key.includes('challenge')) return '🏆'
  return '★'
}

export default async function PublicProfilePage({ params }: Props) {
  const { userId } = await params

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      progress: { where: { completed: true } },
      userAchievements: { include: { achievement: true } },
    },
  })

  if (!user) notFound()

  // Check privacy setting
  let prefs: Record<string, unknown> = {}
  try {
    prefs = user.profile?.adaptivePath ? JSON.parse(user.profile.adaptivePath) : {}
  } catch {
    prefs = {}
  }
  const isPublic = prefs.publicProfile === true

  if (!isPublic) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
        <Navbar />
        <div
          style={{ maxWidth: 480, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: 20 }}>🔒</div>
          <h1
            style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 900, marginBottom: 12 }}
          >
            This profile is private
          </h1>
          <p style={{ color: '#737373', lineHeight: 1.7 }}>
            This guitarist hasn&apos;t made their profile public yet.
          </p>
        </div>
        <Footer />
      </div>
    )
  }

  const name = user.name ?? 'Anonymous'
  const initials = getInitials(user.name)
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
  const currentDay = user.profile?.currentDay ?? 1
  const completedDays = new Set(user.progress.map((p) => p.day))
  const completedCount = completedDays.size
  const completionPct = Math.min(100, Math.round((completedCount / 30) * 100))
  const streak = user.profile?.streak ?? 0
  const totalXP = user.profile?.totalXP ?? 0
  const recentAchievements = user.userAchievements.slice(0, 6)
  const isGraduate = user.profile?.soloCompleted === true
  const gradDate = user.profile?.soloCompletedAt
    ? new Date(user.profile.soloCompletedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '60px 16px 80px' }}>
        {/* Avatar + name */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #1f1f1f',
            borderRadius: 16,
            padding: '32px',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              fontWeight: 900,
              fontSize: '1.5rem',
              margin: '0 auto 16px',
            }}
          >
            {initials}
          </div>

          <h1 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 900, marginBottom: 4 }}>
            {name}
          </h1>
          <p style={{ color: '#525252', fontSize: '0.85rem' }}>Learning since {joinDate}</p>

          {/* Graduate badge */}
          {isGraduate && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: '#1a0f00',
                border: '1px solid #f59e0b',
                borderRadius: 40,
                padding: '6px 16px',
                marginTop: 16,
              }}
            >
              <span>🎓</span>
              <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>
                Graduate{gradDate ? ` · ${gradDate}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            { label: 'Current Streak', value: `${streak}d` },
            { label: 'Total XP', value: totalXP.toLocaleString() },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: '#111111',
                border: '1px solid #1f1f1f',
                borderRadius: 12,
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  color: '#525252',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 6,
                }}
              >
                {stat.label}
              </p>
              <p style={{ color: '#f59e0b', fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #1f1f1f',
            borderRadius: 16,
            padding: '24px',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <h2
              style={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Day {currentDay} of 30
            </h2>
            <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
              {completionPct}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              backgroundColor: '#1a1a1a',
              borderRadius: 999,
              height: 8,
              overflow: 'hidden',
              marginBottom: 16,
            }}
          >
            <div
              style={{
                background: 'linear-gradient(90deg, #f59e0b, #fde68a)',
                width: `${completionPct}%`,
                height: '100%',
                borderRadius: 999,
                transition: 'width 0.5s ease',
              }}
            />
          </div>

          {/* 30-day grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 1fr)',
              gap: 4,
            }}
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                title={`Day ${day}`}
                style={{
                  height: 20,
                  borderRadius: 3,
                  backgroundColor: completedDays.has(day) ? '#f59e0b' : '#1a1a1a',
                  border: `1px solid ${completedDays.has(day) ? '#d97706' : '#262626'}`,
                  transition: 'background-color 0.2s',
                }}
              />
            ))}
          </div>

          <p style={{ color: '#525252', fontSize: '0.75rem', marginTop: 10 }}>
            {completedCount} of 30 days completed
          </p>
        </div>

        {/* Achievements */}
        {recentAchievements.length > 0 && (
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #1f1f1f',
              borderRadius: 16,
              padding: '24px',
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 16,
              }}
            >
              Achievements
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 8,
              }}
            >
              {recentAchievements.map((ua) => (
                <div
                  key={ua.id}
                  style={{
                    backgroundColor: '#0a0a0a',
                    border: '1px solid #1f1f1f',
                    borderRadius: 8,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>
                    {achievementIcon(ua.achievement.key)}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        color: '#d4d4d4',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {ua.achievement.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ color: '#525252', fontSize: '0.9rem', marginBottom: 16 }}>
            Want to learn lead guitar like this?
          </p>
          <Link
            href="/register"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000000',
              padding: '12px 28px',
              borderRadius: 8,
              fontWeight: 900,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Start the 30-Day Program →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
