import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { LESSONS } from '@/lib/lessons'
import Link from 'next/link'
import ProgressBar from '@/components/ProgressBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StreakFreezeButton from '@/components/StreakFreezeButton'
import XPRing from '@/components/XPRing'
import WeeklyActivityChart from '@/components/WeeklyActivityChart'
import GuitarTip from '@/components/GuitarTip'
import OnboardingTour from '@/components/OnboardingTour'
import DailyChallenge from '@/components/DailyChallenge'
import PomodoroTimer from '@/components/PomodoroTimer'
import ReviewQueue from '@/components/ReviewQueue'
import WeeklyPlanCard from '@/components/WeeklyPlanCard'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.purchaseStatus !== 'PAID') redirect('/success?new=true')

  const [profile, progress, practiceSessions] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.progress.findMany({ where: { userId: session.user.id, completed: true }, orderBy: { day: 'asc' } }),
    prisma.practiceSession.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' }, take: 14 }),
  ])

  // Technique unlock thresholds for the solo card progress bar
  const SOLO_TECHNIQUE_DAYS = [1, 5, 6, 7, 8, 12]

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

  const xpLevel = (() => {
    const xp = profile.totalXP
    if (xp >= 2000) return { title: 'Solo Artist', next: null, progress: 100 }
    if (xp >= 1000) return { title: 'Lead Guitarist', next: 2000, progress: Math.round(((xp - 1000) / 1000) * 100) }
    if (xp >= 500) return { title: 'Practitioner', next: 1000, progress: Math.round(((xp - 500) / 500) * 100) }
    if (xp >= 200) return { title: 'Student', next: 500, progress: Math.round(((xp - 200) / 300) * 100) }
    return { title: 'Beginner', next: 200, progress: Math.round((xp / 200) * 100) }
  })()

  const completionEstimate = (() => {
    if (completedDays.size === 0 || completedDays.size >= 30) return null
    const remaining = 30 - completedDays.size
    if (profile.streak === 0) return null
    const daysFromNow = remaining
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })()

  const isXpWeekend = [0, 5, 6].includes(new Date().getDay())

  const isComeback = (() => {
    if (!profile.lastPracticeDate) return false
    const daysSince = Math.floor((Date.now() - new Date(profile.lastPracticeDate).getTime()) / (1000 * 60 * 60 * 24))
    return daysSince >= 3
  })()

  const isPlanStale = (() => {
    if (!profile.weeklyPlanGeneratedAt) return true
    const msSince = Date.now() - new Date(profile.weeklyPlanGeneratedAt).getTime()
    return msSince > 7 * 24 * 60 * 60 * 1000
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
      <style>{`
        @keyframes flame { 0%,100% { transform: scaleY(1) rotate(-1deg); filter: brightness(1); } 25% { transform: scaleY(1.05) rotate(1deg); filter: brightness(1.15); } 75% { transform: scaleY(1.03) rotate(0.5deg); filter: brightness(1.1); } }
        .flame-anim { animation: flame 1.5s ease-in-out infinite; display: inline-block; transform-origin: bottom center; }
        .day-cell { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .day-cell:hover { transform: scale(1.15) !important; }
        .day-done { position: relative; overflow: hidden; }
        .day-done::after { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: shimmerDay 2.5s ease-in-out infinite; }
        @keyframes shimmerDay { 0% { left: -100%; } 100% { left: 100%; } }
        .xp-bar { position: relative; overflow: hidden; }
        .xp-bar::after { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent); animation: shimmerXP 2s ease-in-out infinite 1s; }
        @keyframes shimmerXP { 0% { left: -60%; } 100% { left: 110%; } }
        .xp-badge { position: relative; overflow: hidden; }
        .xp-badge::after { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: shimmerXP 3s ease-in-out infinite; }
      `}</style>

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Comeback banner */}
        {isComeback && profile.streak === 0 && (
          <div
            style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #050510 100%)', border: '1px solid #1e3a5f' }}
            className="rounded-xl p-4 mb-6 flex items-center gap-4"
          >
            <span style={{ fontSize: '2rem', lineHeight: 1 }}>&#127928;</span>
            <div className="flex-1">
              <p className="text-white font-black text-base">Welcome back — the guitar is still waiting.</p>
              <p style={{ color: '#a3a3a3' }} className="text-xs mt-0.5">
                Missed days don&apos;t matter. Just pick up where you left off — today&apos;s lesson is ready.
              </p>
            </div>
            <div style={{ color: '#0ea5e9' }} className="text-2xl font-black hidden sm:block">&#8594;</div>
          </div>
        )}

        {/* Streak banner */}
        {profile.streak >= 2 && !isComeback && (
          <div
            style={{ background: 'linear-gradient(135deg, #1a0f00 0%, #0f0800 100%)', border: '1px solid #78350f' }}
            className="rounded-xl p-4 mb-6 flex items-center gap-4"
          >
            <span className="flame-anim" style={{ fontSize: '2rem', lineHeight: 1, display: 'inline-block' }}>🔥</span>
            <div className="flex-1">
              <p className="text-white font-black text-base">{profile.streak}-day streak — keep it going</p>
              <p style={{ color: '#a3a3a3' }} className="text-xs mt-0.5">
                Practice today to stay on track. {profile.streak >= 7 ? "You're in the top tier of learners." : "Streaks build the habit faster than anything."}
              </p>
            </div>
            <div style={{ color: '#f59e0b' }} className="text-2xl font-black hidden sm:block">{profile.streak}d</div>
          </div>
        )}

        {/* Streak at risk warning */}
        {(() => {
          if (!profile.lastPracticeDate || profile.streak === 0) return null
          const lastDate = new Date(profile.lastPracticeDate)
          const todayStr = new Date().toDateString()
          const lastStr = lastDate.toDateString()
          if (lastStr === todayStr) return null
          return (
            <div
              style={{ background: 'linear-gradient(135deg, #1a0800, #100500)', border: '1px solid rgba(245,158,11,0.3)', borderLeft: '3px solid #f59e0b' }}
              className="rounded-xl p-4 mb-6 flex items-center gap-4"
            >
              <span style={{ fontSize: '1.5rem' }} className="flame-anim">🔥</span>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Your {profile.streak}-day streak is at risk</p>
                <p style={{ color: '#a3a3a3' }} className="text-xs mt-0.5">Practice today to protect it.</p>
              </div>
              <Link href={`/lesson/${currentDay}`} style={{ backgroundColor: '#f59e0b', color: '#000' }} className="text-xs font-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
                Practice Now
              </Link>
            </div>
          )
        })()}

        {/* XP Weekend Multiplier Banner */}
        {isXpWeekend && (
          <div
            style={{ background: 'linear-gradient(135deg, #1a1000 0%, #0f0800 100%)', border: '1px solid #f59e0b' }}
            className="rounded-xl p-4 mb-6 flex items-center gap-4"
          >
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>&#9889;</span>
            <div className="flex-1">
              <p className="text-white font-black text-base">Weekend XP Multiplier Active</p>
              <p style={{ color: '#a3a3a3' }} className="text-xs mt-0.5">
                Earn 1.5&#215; XP on all lessons today!
              </p>
            </div>
            <div style={{ color: '#f59e0b', fontWeight: 900, fontSize: '1.25rem' }} className="hidden sm:block">
              1.5&#215;
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 flex items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-black uppercase">
              <span style={{ color: '#f59e0b' }}>Day {currentDay}</span> of 30
            </h1>
            <p style={{ color: '#a3a3a3' }} className="text-sm mt-1">{motivationalMessage}</p>
          </div>
          <XPRing value={xpLevel.progress} max={100} label={xpLevel.title} xp={profile.totalXP} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Progress', value: `${completionPct}%`, sub: `${completedDays.size} of 30 days`, color: '#ffffff' },
            { label: 'Streak', value: `${profile.streak}d`, sub: 'current', color: '#f59e0b' },
            { label: 'Best Streak', value: `${profile.bestStreak}d`, sub: 'all time', color: '#f59e0b' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
              className="rounded-lg p-4 hover:border-amber-800 transition-colors"
            >
              <p style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider mb-1">{stat.label}</p>
              <p
                style={{
                  color: stat.color,
                  textShadow: stat.color === '#f59e0b' ? '0 0 20px rgba(245,158,11,0.4)' : undefined,
                }}
                className="text-2xl font-black"
              >
                {stat.value}
              </p>
              <p style={{ color: '#525252' }} className="text-xs">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Guitar Tip of the Day */}
        <GuitarTip />

        {/* Daily Challenge */}
        <DailyChallenge currentDay={profile.currentDay} xpReward={25} />

        {/* Pomodoro Timer */}
        <div className="mb-6">
          <PomodoroTimer />
        </div>

        {/* Stale weekly plan prompt */}
        {isPlanStale && (
          <div
            style={{ background: 'linear-gradient(135deg, #1a0f00 0%, #0f0800 100%)', border: '1px solid #78350f' }}
            className="rounded-xl p-4 mb-6 flex items-center gap-4"
          >
            <span style={{ fontSize: '1.25rem' }}>&#128197;</span>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">Your weekly plan needs updating.</p>
              <p style={{ color: '#a3a3a3' }} className="text-xs mt-0.5">Generate a fresh 7-day schedule tailored to your current progress.</p>
            </div>
            <a
              href="#weekly-plan"
              style={{ backgroundColor: '#f59e0b', color: '#000', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}
              className="px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
            >
              Generate Plan &#8594;
            </a>
          </div>
        )}

        {/* Spaced Repetition Review Queue */}
        <ReviewQueue />

        {/* Weekly Practice Plan */}
        <div id="weekly-plan">
          <WeeklyPlanCard />
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
                    className={`rounded flex items-center justify-center relative hover:z-10 day-cell${isDone ? ' day-done' : ''}`}
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
                <span style={{ backgroundColor: '#1a0f00', color: '#f59e0b', border: '1px solid #78350f' }} className="text-xs px-3 py-1 rounded font-bold xp-badge">
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
              <div className="mb-4">
                <WeeklyActivityChart sessions={practiceSessions} />
              </div>
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
                <Link
                  href="/journey"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626' }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:border-amber-600 transition-colors group"
                >
                  <span style={{ color: '#f59e0b' }} className="text-lg">&#127928;</span>
                  <div>
                    <p className="text-white text-sm group-hover:text-amber-400 transition-colors">Journey Map</p>
                    <p style={{ color: '#525252' }} className="text-xs">View your 30-day path</p>
                  </div>
                </Link>
                <Link
                  href="/techniques"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626' }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:border-amber-600 transition-colors group"
                >
                  <span style={{ color: '#f59e0b' }} className="text-lg">&#128218;</span>
                  <div>
                    <p className="text-white text-sm group-hover:text-amber-400 transition-colors">Technique Library</p>
                    <p style={{ color: '#525252' }} className="text-xs">Reference &amp; exercises</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Target Solo Card */}
            {profile.customSolo ? (
              <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">Your Target Solo</h3>
                  <span style={{ backgroundColor: '#1a1000', border: '1px solid #78350f', color: '#f59e0b' }} className="text-xs font-bold px-2 py-0.5 rounded">
                    {profile.soloStyle ? profile.soloStyle.charAt(0).toUpperCase() + profile.soloStyle.slice(1) : 'Custom'}
                    {profile.guitarHero ? ` · ${profile.guitarHero}` : ''}
                  </span>
                </div>
                {/* Tab preview — first 2 lines */}
                <div
                  style={{ backgroundColor: '#0d0d0d', borderLeft: '3px solid #f59e0b' }}
                  className="rounded px-3 py-2 mb-3 overflow-x-auto"
                >
                  <pre style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: '10px', color: '#d4d4d4', lineHeight: 1.5 }}>
                    {profile.customSolo.split('\n').filter((l) => /^[eBGDAE]\|/.test(l)).slice(0, 2).join('\n')}
                  </pre>
                </div>
                {/* Techniques progress bar */}
                {(() => {
                  const unlocked = SOLO_TECHNIQUE_DAYS.filter((d) => currentDay >= d).length
                  const pct = Math.round((unlocked / SOLO_TECHNIQUE_DAYS.length) * 100)
                  return (
                    <div className="mb-3">
                      <div style={{ backgroundColor: '#1a1a1a', height: 4 }} className="rounded-full overflow-hidden mb-1">
                        <div
                          style={{ background: 'linear-gradient(90deg, #f59e0b, #fde68a)', width: `${pct}%`, height: '100%', transition: 'width 0.3s' }}
                          className="rounded-full"
                        />
                      </div>
                      <p style={{ color: '#525252' }} className="text-xs">{unlocked}/{SOLO_TECHNIQUE_DAYS.length} techniques unlocked</p>
                    </div>
                  )
                })()}
                <Link
                  href="/my-solo"
                  style={{ color: '#f59e0b', border: '1px solid #78350f' }}
                  className="text-xs font-bold flex items-center gap-1 hover:opacity-80 transition-opacity px-3 py-1.5 rounded justify-center"
                >
                  View Full Solo &#8594;
                </Link>
              </div>
            ) : (
              <div
                style={{ background: 'linear-gradient(135deg, #1a1000 0%, #0f0800 100%)', border: '1px solid #78350f' }}
                className="rounded-xl p-5"
              >
                <div style={{ fontSize: '1.5rem', lineHeight: 1, marginBottom: '0.5rem' }}>🎸</div>
                <h3 className="text-white font-bold text-sm mb-1">Your Solo Awaits</h3>
                <p style={{ color: '#a3a3a3' }} className="text-xs mb-4 leading-snug">
                  Generate your personalized guitar solo — the goal this entire course is building toward.
                </p>
                <Link
                  href="/my-solo"
                  style={{ backgroundColor: '#f59e0b', color: '#000' }}
                  className="text-xs font-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity inline-block"
                >
                  Create My Solo &#8594;
                </Link>
              </div>
            )}

            {/* Weekly goal */}
            {(() => {
              const now = new Date()
              const dayOfWeek = now.getDay()
              const startOfWeek = new Date(now)
              startOfWeek.setDate(now.getDate() - dayOfWeek)
              startOfWeek.setHours(0, 0, 0, 0)
              const completedThisWeek = progress.filter(
                (p) => p.completedAt && new Date(p.completedAt) >= startOfWeek
              ).length
              const goalDays = profile.weeklyGoalDays
              const pct = Math.min(100, Math.round((completedThisWeek / goalDays) * 100))
              return (
                <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Weekly Goal</h3>
                  <div className="flex items-end justify-between mb-2">
                    <p style={{ color: '#f59e0b' }} className="text-xl font-black">
                      {completedThisWeek}/{goalDays}
                    </p>
                    <p style={{ color: '#525252' }} className="text-xs">days this week</p>
                  </div>
                  <div style={{ backgroundColor: '#1a1a1a', height: 6 }} className="rounded-full overflow-hidden mb-1">
                    <div
                      style={{ background: 'linear-gradient(90deg, #f59e0b, #fde68a)', width: `${pct}%`, height: '100%', transition: 'width 0.3s' }}
                      className="rounded-full xp-bar"
                    />
                  </div>
                  <p style={{ color: '#525252' }} className="text-xs">
                    {pct >= 100 ? 'Weekly goal met!' : `${goalDays - completedThisWeek} day${goalDays - completedThisWeek !== 1 ? 's' : ''} to go`}
                  </p>
                </div>
              )
            })()}

            {/* Streak freeze */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Streak Protection</h3>
              <StreakFreezeButton streakFreezes={profile.streakFreezes} streak={profile.streak} />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Onboarding Tour — shown to new users who haven't seen it yet */}
      <OnboardingTour
        show={profile.currentDay <= 1 && !profile.lastPracticeDate}
        onDone={() => {}}
      />
    </div>
  )
}
