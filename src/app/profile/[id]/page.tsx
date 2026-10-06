import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const profile = await prisma.profile.findUnique({
    where: { userId: id },
    include: { user: { select: { name: true } } },
  })
  if (!profile) return { title: 'Profile Not Found — First Guitar Solo' }
  return {
    title: `${profile.user.name ?? 'Student'} — First Guitar Solo`,
    description: `${profile.user.name ?? 'A student'} is learning lead guitar on First Guitar Solo.`,
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  const [profile, completedCount, achievements] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId: id },
      include: { user: { select: { id: true, name: true } } },
    }),
    prisma.progress.count({ where: { userId: id, completed: true } }),
    prisma.userAchievement.findMany({
      where: { userId: id },
      include: { achievement: { select: { key: true, name: true, description: true } } },
      orderBy: { unlockedAt: 'asc' },
    }),
  ])

  if (!profile) notFound()

  const isOwner = session?.user?.id === id
  const completionPct = Math.round((completedCount / 30) * 100)
  const isGraduate = completionPct === 100

  const xpTitle = (() => {
    const xp = profile.totalXP
    if (xp >= 2000) return 'Solo Artist'
    if (xp >= 1000) return 'Lead Guitarist'
    if (xp >= 500) return 'Practitioner'
    if (xp >= 200) return 'Student'
    return 'Beginner'
  })()

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Profile header */}
        <div
          style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
          className="rounded-2xl p-8 mb-6"
        >
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-6">
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                backgroundColor: '#1a1000',
                border: '2px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ color: '#f59e0b', fontSize: '2rem', fontWeight: 900 }}>
                {(profile.user.name ?? 'A').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                {profile.user.name ?? 'Anonymous Student'}
              </h1>
              <p style={{ color: '#a3a3a3' }} className="text-sm mt-0.5">
                {xpTitle} &middot; {profile.totalXP.toLocaleString()} XP
              </p>
              {isOwner && (
                <Link
                  href="/dashboard"
                  style={{ color: '#f59e0b' }}
                  className="text-xs font-bold hover:underline mt-1 inline-block"
                >
                  ← Go to your Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Graduate badge */}
          {isGraduate && (
            <div
              style={{
                background: 'linear-gradient(135deg, #1a0f00, #0f0800)',
                border: '1px solid #f59e0b',
                borderRadius: 12,
              }}
              className="flex items-center gap-3 px-5 py-3 mb-6"
            >
              <span style={{ fontSize: '1.5rem' }}>🎸</span>
              <div>
                <p style={{ color: '#f59e0b' }} className="font-black text-sm uppercase tracking-wider">
                  First Guitar Solo Graduate
                </p>
                <p style={{ color: '#a3a3a3' }} className="text-xs mt-0.5">
                  Completed all 30 days of the program
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Completion', value: `${completionPct}%`, sub: `${completedCount}/30 days` },
              { label: 'Current Streak', value: `${profile.streak}d`, sub: 'days in a row', amber: true },
              { label: 'Best Streak', value: `${profile.bestStreak}d`, sub: 'all time', amber: true },
              { label: 'Total XP', value: profile.totalXP.toLocaleString(), sub: xpTitle },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f' }}
                className="rounded-lg p-3"
              >
                <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <p
                  style={{
                    color: stat.amber ? '#f59e0b' : '#ffffff',
                    fontWeight: 900,
                    fontSize: '1.25rem',
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ color: '#404040' }} className="text-xs mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
          className="rounded-xl p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">Program Progress</h2>
            <span style={{ color: '#f59e0b' }} className="text-sm font-bold">{completionPct}%</span>
          </div>
          <div style={{ backgroundColor: '#1a1a1a', height: 8 }} className="rounded-full overflow-hidden">
            <div
              style={{
                background: 'linear-gradient(90deg, #f59e0b, #fde68a)',
                width: `${completionPct}%`,
                height: '100%',
                transition: 'width 0.5s ease',
              }}
              className="rounded-full"
            />
          </div>
          <p style={{ color: '#525252' }} className="text-xs mt-2">
            {completedCount} of 30 days completed
          </p>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div
            style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
            className="rounded-xl p-6"
          >
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Achievements ({achievements.length})
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {achievements.map((ua) => (
                <div
                  key={ua.id}
                  style={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f' }}
                  className="rounded-lg px-4 py-3 flex items-center gap-3"
                >
                  <span style={{ color: '#f59e0b' }} className="text-lg">★</span>
                  <div className="min-w-0">
                    <p style={{ color: '#d4d4d4' }} className="text-sm font-bold truncate">
                      {ua.achievement.name}
                    </p>
                    <p style={{ color: '#525252' }} className="text-xs truncate">
                      {ua.achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share / CTA */}
        {isOwner ? (
          <div className="mt-6 text-center">
            <p style={{ color: '#525252' }} className="text-xs mb-1">Share your profile</p>
            <code
              style={{
                backgroundColor: '#111111',
                border: '1px solid #262626',
                color: '#a3a3a3',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: '0.75rem',
                display: 'inline-block',
              }}
            >
              {typeof window !== 'undefined' ? window.location.href : `/profile/${id}`}
            </code>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <p style={{ color: '#525252' }} className="text-sm mb-3">
              Want to learn lead guitar like this?
            </p>
            <Link
              href="/#pricing"
              style={{ backgroundColor: '#f59e0b', color: '#000' }}
              className="inline-block px-8 py-3 rounded-lg text-sm font-black uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Start the 30-Day Program →
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
