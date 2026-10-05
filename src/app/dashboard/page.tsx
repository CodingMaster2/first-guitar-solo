import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { LESSONS } from '@/lib/lessons'
import Link from 'next/link'
import ProgressBar from '@/components/ProgressBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.purchaseStatus !== 'PAID') redirect('/success?new=true')

  const [profile, progress, practiceSessions] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.progress.findMany({ where: { userId: session.user.id, completed: true }, orderBy: { day: 'asc' } }),
    prisma.practiceSession.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' }, take: 5 }),
  ])

  if (!profile) redirect('/onboarding')

  const currentDay = profile.currentDay
  const completedDays = new Set(progress.map((p) => p.day))
  const completionPct = Math.round((completedDays.size / 30) * 100)
  const currentLesson = LESSONS.find((l) => l.day === currentDay) ?? LESSONS[0]

  const motivationalMessage = (() => {
    if (completedDays.size === 0) return 'Day 1. Every great guitarist started here.'
    if (completionPct === 100) return 'You completed the entire program. That\'s rare.'
    if (completionPct >= 50) return 'Halfway there. The solo is within reach.'
    if (profile.streak >= 7) return `${profile.streak}-day streak. You're on a roll.`
    if (profile.streak >= 3) return `${profile.streak} days in a row. Build the habit.`
    if (profile.streak === 2) return '2 days in a row. Momentum is building.'
    return session.user.name ? `Welcome back, ${session.user.name}.` : 'Welcome back.'
  })()

  // Skill levels based on profile + completed days
  const skills = [
    { name: 'Picking', level: Math.min(100, (profile.pickingLevel ?? 1) * 15 + completedDays.size * 1.5) },
    { name: 'Hammer-ons', level: Math.min(100, (profile.hammerOnLevel ?? 1) * 15 + Math.max(0, completedDays.size - 3) * 2) },
    { name: 'Pull-offs', level: Math.min(100, (profile.pullOffLevel ?? 1) * 15 + Math.max(0, completedDays.size - 4) * 2) },
    { name: 'Slides', level: Math.min(100, (profile.slideLevel ?? 1) * 15 + Math.max(0, completedDays.size - 5) * 2) },
    { name: 'Pentatonic', level: Math.min(100, (profile.pentatonicLevel ?? 1) * 12 + Math.max(0, completedDays.size - 7) * 3) },
    { name: 'Bends', level: Math.min(100, (profile.bendLevel ?? 1) * 12 + Math.max(0, completedDays.size - 11) * 3) },
    { name: 'Vibrato', level: Math.min(100, (profile.vibratoLevel ?? 1) * 12 + Math.max(0, completedDays.size - 12) * 3) },
    { name: 'Solo', level: Math.min(100, Math.max(0, completedDays.size - 14) * 7) },
  ]

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase">
            <span style={{ color: '#f59e0b' }}>Day {currentDay}</span> of 30
          </h1>
          <p style={{ color: '#a3a3a3' }} className="text-sm mt-1">
            {motivationalMessage}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-lg p-4">
            <p style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider mb-1">Progress</p>
            <p className="text-white text-2xl font-black">{completionPct}%</p>
            <ProgressBar value={completionPct} height={4} />
          </div>
          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-lg p-4">
            <p style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider mb-1">Streak</p>
            <p className="text-white text-2xl font-black">
              {profile.streak} <span className="text-xl">&#128293;</span>
            </p>
            <p style={{ color: '#a3a3a3' }} className="text-xs">days</p>
          </div>
          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-lg p-4">
            <p style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider mb-1">Total XP</p>
            <p style={{ color: '#f59e0b' }} className="text-2xl font-black">{profile.totalXP}</p>
            <p style={{ color: '#a3a3a3' }} className="text-xs">experience</p>
          </div>
          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-lg p-4">
            <p style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider mb-1">Days Done</p>
            <p className="text-white text-2xl font-black">{completedDays.size}</p>
            <p style={{ color: '#a3a3a3' }} className="text-xs">of 30</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's lesson */}
          <div className="lg:col-span-2">
            <div
              style={{ backgroundColor: '#111111', border: '2px solid #f59e0b' }}
              className="rounded-xl p-6 mb-6"
            >
              <div style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-2">
                Today&apos;s Lesson
              </div>
              <p style={{ color: '#a3a3a3' }} className="text-xs mb-1">Week {currentLesson.week} · Day {currentLesson.day}</p>
              <h2 className="text-2xl font-black text-white mb-2">{currentLesson.title}</h2>
              <p style={{ color: '#a3a3a3' }} className="text-sm mb-4">{currentLesson.subtitle}</p>
              <div className="flex items-center gap-4 mb-6">
                <span style={{ backgroundColor: '#1a1a1a', color: '#a3a3a3', border: '1px solid #262626' }} className="text-xs px-3 py-1 rounded">
                  {currentLesson.duration} min
                </span>
                <span style={{ backgroundColor: '#1a1a1a', color: '#f59e0b', border: '1px solid #262626' }} className="text-xs px-3 py-1 rounded">
                  +{currentLesson.xpReward} XP
                </span>
              </div>
              {completedDays.has(currentDay) ? (
                <div className="flex gap-3">
                  <Link
                    href={`/lesson/${currentDay}`}
                    style={{ border: '1px solid #262626', color: '#a3a3a3' }}
                    className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:text-white transition-colors"
                  >
                    Review
                  </Link>
                  {currentDay < 30 && (
                    <Link
                      href={`/lesson/${currentDay + 1}`}
                      style={{ backgroundColor: '#f59e0b', color: '#000' }}
                      className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                      Next Lesson &#8594;
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  href={`/lesson/${currentDay}`}
                  style={{ backgroundColor: '#f59e0b', color: '#000' }}
                  className="inline-block px-8 py-3 rounded-lg text-sm font-black uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Start Today&apos;s Lesson &#8594;
                </Link>
              )}
            </div>

            {/* Recent activity */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Recent Activity</h3>
              {practiceSessions.length === 0 ? (
                <p style={{ color: '#a3a3a3' }} className="text-sm">No practice sessions yet. Complete your first lesson to start!</p>
              ) : (
                <div className="space-y-2">
                  {practiceSessions.map((s) => {
                    const lesson = LESSONS.find((l) => l.day === s.day)
                    return (
                      <div
                        key={s.id}
                        style={{ borderBottom: '1px solid #1a1a1a' }}
                        className="flex justify-between items-center py-2"
                      >
                        <div>
                          <p className="text-white text-sm">Day {s.day}: {lesson?.title ?? 'Lesson'}</p>
                          <p style={{ color: '#a3a3a3' }} className="text-xs">
                            {new Date(s.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span style={{ color: '#a3a3a3' }} className="text-xs">{s.duration} min</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Skills</h3>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <ProgressBar
                    key={skill.name}
                    value={skill.level}
                    label={skill.name}
                    showLabel
                    height={6}
                  />
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/coach"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626' }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:border-amber-500 transition-colors"
                >
                  <span style={{ color: '#f59e0b' }}>&#9899;</span>
                  <span className="text-white text-sm">AI Guitar Coach</span>
                </Link>
                <Link
                  href="/progress"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626' }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:border-amber-500 transition-colors"
                >
                  <span style={{ color: '#f59e0b' }}>&#8593;</span>
                  <span className="text-white text-sm">Full Progress View</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
