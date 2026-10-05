import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { LESSONS } from '@/lib/lessons'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProgressBar from '@/components/ProgressBar'

export default async function ProgressPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.purchaseStatus !== 'PAID') redirect('/success?new=true')

  const [profile, progress, practiceSessions, userAchievements, allAchievements] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.progress.findMany({ where: { userId: session.user.id }, orderBy: { day: 'asc' } }),
    prisma.practiceSession.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.userAchievement.findMany({ where: { userId: session.user.id }, include: { achievement: true } }),
    prisma.achievement.findMany(),
  ])

  if (!profile) redirect('/onboarding')

  const completedDays = new Set(progress.filter((p) => p.completed).map((p) => p.day))
  const completionPct = Math.round((completedDays.size / 30) * 100)
  const totalPracticeTime = practiceSessions.reduce((sum, s) => sum + s.duration, 0)

  const longestSession = practiceSessions.length > 0 ? Math.max(...practiceSessions.map((s) => s.duration)) : 0
  const totalSessionCount = practiceSessions.length
  const earnedAchievementXP = userAchievements.reduce((sum, ua) => sum + ua.achievement.xpReward, 0)
  const weeklyPractice = (() => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    return practiceSessions.filter((s) => new Date(s.createdAt) >= weekStart).length
  })()

  const earnedAchievementIds = new Set(userAchievements.map((ua) => ua.achievementId))

  // Week completion
  const weeks = [
    { label: 'Week 1', days: [1, 2, 3, 4, 5, 6, 7] },
    { label: 'Week 2', days: [8, 9, 10, 11, 12, 13, 14] },
    { label: 'Week 3', days: [15, 16, 17, 18, 19, 20, 21] },
    { label: 'Week 4', days: [22, 23, 24, 25, 26, 27, 28, 29, 30] },
  ]

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
        <h1 className="text-3xl font-black text-white uppercase mb-8">Your Progress</h1>

        {/* Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Completion', value: `${completionPct}%`, sub: `${completedDays.size}/30 days`, color: '#ffffff' },
            { label: 'Current Streak', value: `${profile.streak}d`, sub: 'days in a row', color: '#f59e0b' },
            { label: 'Total Sessions', value: String(practiceSessions.length), sub: 'practice sessions', color: '#ffffff' },
            { label: 'Total Time', value: `${totalPracticeTime}`, sub: 'minutes practiced', color: '#ffffff' },
          ].map((s) => (
            <div key={s.label} style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-lg p-4 hover:border-amber-800 transition-colors">
              <p style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider mb-1">{s.label}</p>
              <p style={{ color: s.color }} className="text-2xl font-black">{s.value}</p>
              <p style={{ color: '#525252' }} className="text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* 30-day grid */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5 mb-8">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4">All 30 Days</h2>
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isDone = completedDays.has(day)
              const lesson = LESSONS.find((l) => l.day === day)
              return (
                <Link href={`/lesson/${day}`} key={day} title={`Day ${day}: ${lesson?.title ?? ''}`}>
                  <div
                    style={{
                      backgroundColor: isDone ? '#f59e0b' : '#161616',
                      border: isDone ? '1px solid #d97706' : '1px solid #1f1f1f',
                      aspectRatio: '1',
                    }}
                    className="rounded flex items-center justify-center transition-all hover:scale-110"
                  >
                    <span style={{ color: isDone ? '#000' : '#404040', fontSize: '0.6rem' }} className="font-black">
                      {isDone ? '✓' : day}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Week by week */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Week by Week</h2>
            <div className="space-y-4">
              {weeks.map((week) => {
                const done = week.days.filter((d) => completedDays.has(d)).length
                const pct = Math.round((done / week.days.length) * 100)
                return (
                  <div key={week.label}>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: '#a3a3a3' }} className="text-sm">{week.label}</span>
                      <span style={{ color: '#a3a3a3' }} className="text-xs">{done}/{week.days.length}</span>
                    </div>
                    <ProgressBar value={pct} height={8} />
                    <div className="flex gap-1 mt-2">
                      {week.days.map((d) => (
                        <div
                          key={d}
                          style={{
                            backgroundColor: completedDays.has(d) ? '#f59e0b' : '#262626',
                            width: '100%',
                            height: '4px',
                          }}
                          className="rounded-full"
                          title={`Day ${d}`}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Technique breakdown */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Technique Breakdown</h2>
            <div className="space-y-3">
              {skills.map((skill) => (
                <ProgressBar key={skill.name} value={skill.level} label={skill.name} showLabel height={8} />
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-8">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {allAchievements.map((achievement) => {
              const earned = earnedAchievementIds.has(achievement.id)
              const userAch = userAchievements.find((ua) => ua.achievementId === achievement.id)
              return (
                <div
                  key={achievement.id}
                  style={{
                    backgroundColor: earned ? '#1a1200' : '#1a1a1a',
                    border: `1px solid ${earned ? '#f59e0b' : '#262626'}`,
                    opacity: earned ? 1 : 0.5,
                  }}
                  className="p-4 rounded-lg"
                >
                  <div style={{ color: earned ? '#f59e0b' : '#a3a3a3' }} className="text-2xl mb-2">
                    {earned ? '★' : '☆'}
                  </div>
                  <p style={{ color: earned ? '#ffffff' : '#a3a3a3' }} className="text-sm font-bold mb-1">
                    {achievement.name}
                  </p>
                  <p style={{ color: '#a3a3a3' }} className="text-xs mb-2">{achievement.description}</p>
                  <p style={{ color: '#f59e0b' }} className="text-xs">+{achievement.xpReward} XP</p>
                  {earned && userAch && (
                    <p style={{ color: '#a3a3a3' }} className="text-xs mt-1">
                      {new Date(userAch.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Personal Records */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-8">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Personal Records</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Best Streak', value: `${profile.streak}d`, sub: 'days in a row', color: '#f59e0b' },
              { label: 'This Week', value: `${weeklyPractice}`, sub: 'sessions', color: '#ffffff' },
              { label: 'Longest Session', value: longestSession > 0 ? `${longestSession} min` : '—', sub: 'single session', color: '#ffffff' },
              { label: 'Achievement XP', value: `+${earnedAchievementXP}`, sub: 'from achievements', color: '#f59e0b' },
            ].map((r) => (
              <div key={r.label} style={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f' }} className="rounded-lg p-4">
                <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-1">{r.label}</p>
                <p style={{ color: r.color }} className="text-xl font-black">{r.value}</p>
                <p style={{ color: '#404040' }} className="text-xs">{r.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate banner */}
        {completedDays.has(30) && (
          <div
            style={{ backgroundColor: '#1a1200', border: '1px solid #d97706' }}
            className="rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <p style={{ color: '#f59e0b' }} className="font-bold text-sm mb-1">🎸 You completed the program!</p>
              <p style={{ color: '#a3a3a3' }} className="text-xs">Your certificate of completion is ready to download and share.</p>
            </div>
            <Link
              href="/certificate"
              style={{ backgroundColor: '#f59e0b', color: '#000000', whiteSpace: 'nowrap' }}
              className="text-sm font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
            >
              View Certificate
            </Link>
          </div>
        )}

        {/* Practice history */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Practice History</h2>
          {practiceSessions.length === 0 ? (
            <p style={{ color: '#a3a3a3' }} className="text-sm">No practice sessions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #262626' }}>
                    <th style={{ color: '#a3a3a3' }} className="text-left pb-3 text-xs uppercase tracking-wider font-medium">Date</th>
                    <th style={{ color: '#a3a3a3' }} className="text-left pb-3 text-xs uppercase tracking-wider font-medium">Lesson</th>
                    <th style={{ color: '#a3a3a3' }} className="text-left pb-3 text-xs uppercase tracking-wider font-medium">Duration</th>
                    <th style={{ color: '#a3a3a3' }} className="text-left pb-3 text-xs uppercase tracking-wider font-medium">Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {practiceSessions.map((s) => {
                    const lesson = LESSONS.find((l) => l.day === s.day)
                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                        <td style={{ color: '#a3a3a3' }} className="py-2 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                        <td className="text-white py-2 text-xs">Day {s.day}: {lesson?.title}</td>
                        <td style={{ color: '#a3a3a3' }} className="py-2 text-xs">{s.duration} min</td>
                        <td style={{ color: '#a3a3a3' }} className="py-2 text-xs capitalize">{s.difficulty ?? '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
