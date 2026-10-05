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

        {/* Streak banner */}
        {profile.streak >= 2 && (
          <div
            style={{ background: 'linear-gradient(135deg, #1a0f00 0%, #0f0800 100%)', border: '1px solid #78350f' }}
            className="rounded-xl p-4 mb-6 flex items-center gap-4"
          >
            <span style={{ fontSize: '2rem', lineHeight: 1 }}>&#128293;</span>
            <div className="flex-1">
              <p className="text-white font-black text-base">{profile.streak}-day streak — keep it going</p>
              <p style={{ color: '#a3a3a3' }} className="text-xs mt-0.5">
                Practice today to stay on track. {profile.streak >= 7 ? "You're in the top tier of learners." : "Streaks build the habit faster than anything."}
              </p>
            </div>
            <div style={{ color: '#f59e0b' }} className="text-2xl font-black hidden sm:block">{profile.streak}d</div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black uppercase">
            <span style={{ color: '#f59e0b' }}>Day {currentDay}</span> of 30
          </h1>
          <p style={{ color: '#a3a3a3' }} className="text-sm mt-1">{motivationalMessage}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Progress', value: `${completionPct}%`, sub: `${completedDays.size} of 30 days`, color: '#ffffff' },
            { label: 'Streak', value: `${profile.streak}d`, sub: 'current', color: '#f59e0b' },
            { label: 'Total XP', value: profile.totalXP.toLocaleString(), sub: 'experience', color: '#f59e0b' },
            { label: 'This Week', value: `${[...completedDays].filter(d => d >= currentDay - 6 && d <= currentDay).length}/7`, sub: 'days practiced', color: '#ffffff' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
              className="rounded-lg p-4 hover:border-amber-800 transition-colors"
            >
              <p style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider mb-1">{stat.label}</p>
              <p style={{ color: stat.color }} className="text-2xl font-black">{stat.value}</p>
              <p style={{ color: '#525252' }} className="text-xs">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* 30-day journey grid */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Your Journey</h3>
            <span style={{ color: '#a3a3a3' }} className="text-xs">{completedDays.size}/30 days complete</span>
          </div>
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isDone = completedDays.has(day)
              const isCurrent = day === currentDay
              const isPast = day < currentDay && !isDone
              return (
                <Link href={`/lesson/${day}`} key={day} title={`Day ${day}: ${LESSONS.find(l => l.day === day)?.title ?? ''}`}>
                  <div
                    style={{
                      backgroundColor: isDone ? '#f59e0b' : isCurrent ? '#1a1000' : '#161616',
                      border: isCurrent ? '2px solid #f59e0b' : isDone ? '1px solid #d97706' : '1px solid #1f1f1f',
                      aspectRatio: '1',
                      opacity: isPast ? 0.5 : 1,
                    }}
                    className="rounded flex items-center justify-center transition-all hover:scale-110 hover:z-10 relative"
                  >
                    <span style={{ color: isDone ? '#000' : isCurrent ? '#f59e0b' : '#404040', fontSize: '0.6rem' }} className="font-black">
                      {isDone ? '✓' : day}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div style={{ backgroundColor: '#f59e0b', width: 10, height: 10 }} className="rounded-sm" />
              <span style={{ color: '#525252' }} className="text-xs">Done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div style={{ border: '2px solid #f59e0b', backgroundColor: '#1a1000', width: 10, height: 10 }} className="rounded-sm" />
              <span style={{ color: '#525252' }} className="text-xs">Today</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div style={{ backgroundColor: '#161616', border: '1px solid #1f1f1f', width: 10, height: 10 }} className="rounded-sm" />
              <span style={{ color: '#525252' }} className="text-xs">Upcoming</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's lesson */}
          <div className="lg:col-span-2">
            <div
              style={{ backgroundColor: '#111111', border: '2px solid #f59e0b', background: 'linear-gradient(135deg, #111111 0%, #0f0e00 100%)' }}
              className="rounded-xl p-6 mb-6"
            >
              <div style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-2">
                Today&apos;s Lesson
              </div>
              <p style={{ color: '#a3a3a3' }} className="text-xs mb-1">Week {currentLesson.week} &middot; Day {currentLesson.day}</p>
              <h2 className="text-2xl font-black text-white mb-2">{currentLesson.title}</h2>
              <p style={{ color: '#a3a3a3' }} className="text-sm mb-4">{currentLesson.subtitle}</p>
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span style={{ backgroundColor: '#1a1a1a', color: '#a3a3a3', border: '1px solid #262626' }} className="text-xs px-3 py-1 rounded">
                  {currentLesson.duration} min
                </span>
                <span style={{ backgroundColor: '#1a0f00', color: '#f59e0b', border: '1px solid #78350f' }} className="text-xs px-3 py-1 rounded font-bold">
                  +{currentLesson.xpReward} XP
                </span>
                {currentLesson.week && (
                  <span style={{ backgroundColor: '#0a0a0a', color: '#525252', border: '1px solid #1f1f1f' }} className="text-xs px-3 py-1 rounded">
                    Week {currentLesson.week}
                  </span>
                )}
              </div>
              {completedDays.has(currentDay) ? (
                <div className="flex gap-3">
                  <Link
                    href={`/lesson/${currentDay}`}
                    style={{ border: '1px solid #262626', color: '#a3a3a3' }}
                    className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:text-white hover:border-gray-400 transition-colors"
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
                <div className="text-center py-6">
                  <p style={{ color: '#f59e0b' }} className="text-2xl mb-2">&#9654;</p>
                  <p style={{ color: '#a3a3a3' }} className="text-sm">No sessions yet.</p>
                  <p style={{ color: '#525252' }} className="text-xs mt-1">Complete your first lesson to start.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {practiceSessions.map((s) => {
                    const lesson = LESSONS.find((l) => l.day === s.day)
                    return (
                      <Link
                        key={s.id}
                        href={`/lesson/${s.day}`}
                        style={{ borderBottom: '1px solid #1a1a1a' }}
                        className="flex justify-between items-center py-2.5 hover:opacity-80 transition-opacity block"
                      >
                        <div>
                          <p className="text-white text-sm">Day {s.day}: {lesson?.title ?? 'Lesson'}</p>
                          <p style={{ color: '#525252' }} className="text-xs">
                            {new Date(s.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span style={{ color: '#a3a3a3' }} className="text-xs">{s.duration} min</span>
                          {s.difficulty && (
                            <p style={{ color: s.difficulty === 'easy' ? '#22c55e' : s.difficulty === 'struggled' ? '#ef4444' : '#f59e0b' }} className="text-xs capitalize">{s.difficulty}</p>
                          )}
                        </div>
                      </Link>
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
                  <ProgressBar key={skill.name} value={skill.level} label={skill.name} showLabel height={6} />
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
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:border-amber-600 transition-colors group"
                >
                  <span style={{ color: '#f59e0b' }} className="text-lg">&#9899;</span>
                  <div>
                    <p className="text-white text-sm group-hover:text-amber-400 transition-colors">AI Guitar Coach</p>
                    <p style={{ color: '#525252' }} className="text-xs">Ask anything</p>
                  </div>
                </Link>
                <Link
                  href="/progress"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626' }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:border-amber-600 transition-colors group"
                >
                  <span style={{ color: '#f59e0b' }} className="text-lg">&#8593;</span>
                  <div>
                    <p className="text-white text-sm group-hover:text-amber-400 transition-colors">Full Progress</p>
                    <p style={{ color: '#525252' }} className="text-xs">Stats &amp; achievements</p>
                  </div>
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
