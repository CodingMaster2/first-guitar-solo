import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { LESSONS } from '@/lib/lessons'
import { getLevelInfo } from '@/lib/levels'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import XPRing from '@/components/XPRing'
import LevelBadge from '@/components/LevelBadge'
import PracticeCalendar from '@/components/PracticeCalendar'
import DashboardCountUp from '@/components/DashboardCountUp'
import TodaysMission from '@/components/TodaysMission'
import MilestonePrompt from '@/components/MilestonePrompt'
import ReviewQueue from '@/components/ReviewQueue'
import WeeklyPlanCard from '@/components/WeeklyPlanCard'
import AdaptivePath from '@/components/AdaptivePath'
import PartnerWidget from '@/components/PartnerWidget'
import StreakFlame from '@/components/StreakFlame'
import LevelUpTrigger from '@/components/LevelUpTrigger'
import PracticeChart from '@/components/PracticeChart'
import StreakCalendar from '@/components/StreakCalendar'
import ReviewReminders from '@/components/ReviewReminders'
import CompletionEstimate from '@/components/CompletionEstimate'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — First Guitar Solo',
}

const GUITARIST_QUOTES = [
  { quote: 'The more you practice, the luckier you get.', author: 'Gary Player' },
  { quote: 'My guitar is not a thing. It is an extension of myself.', author: 'Joan Jett' },
  { quote: 'If you hit a wrong note, it\'s the next note that makes it good or bad.', author: 'Miles Davis' },
  { quote: 'Tone is in the fingers.', author: 'Stevie Ray Vaughan' },
  { quote: 'Without music, life would be a mistake.', author: 'Nietzsche' },
  { quote: 'Play it loud.', author: 'Eric Clapton' },
  { quote: 'The guitar is a small orchestra.', author: 'Beethoven' },
]

const QUICK_ACTIONS = [
  { label: "Today's Lesson", icon: '🎸', href: '#' },
  { label: 'AI Coach', icon: '🤖', href: '/coach' },
  { label: 'My Solo', icon: '⚡', href: '/my-solo' },
  { label: 'Leaderboard', icon: '🏆', href: '/leaderboard' },
  { label: 'Trophy Room', icon: '🏅', href: '/trophy-room' },
  { label: 'Challenges', icon: '⚔️', href: '/challenges' },
]

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.purchaseStatus !== 'PAID') redirect('/success?new=true')

  const [profile, progress, practiceSessions, reviewsDue] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.progress.findMany({ where: { userId: session.user.id }, orderBy: { day: 'asc' } }),
    prisma.practiceSession.findMany({
      where: { userId: session.user.id },
      select: { day: true, duration: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.progress.count({
      where: { userId: session.user.id, nextReviewAt: { lte: new Date() }, completed: true },
    }),
  ])

  if (!profile) redirect('/onboarding')

  // Streak at risk: streak > 0 and last practice was exactly yesterday
  const streak = profile.streak
  const lastPracticeDate = profile.lastPracticeDate
  let streakAtRisk = false
  if (streak > 0 && lastPracticeDate) {
    const todayUTC = new Date()
    todayUTC.setHours(0, 0, 0, 0)
    const yesterdayUTC = new Date(todayUTC)
    yesterdayUTC.setDate(yesterdayUTC.getDate() - 1)
    const lastPracticeDay = new Date(lastPracticeDate)
    lastPracticeDay.setHours(0, 0, 0, 0)
    streakAtRisk =
      lastPracticeDay.getTime() === yesterdayUTC.getTime()
  }

  const currentDay = profile.currentDay
  const completedDays = new Set(progress.filter((p) => p.completed).map((p) => p.day))
  const completionPct = Math.round((completedDays.size / 30) * 100)
  const currentLesson = LESSONS.find((l) => l.day === currentDay) ?? LESSONS[0]
  const isCompleted = completedDays.has(currentDay)

  const { current: levelInfo, nextLevel } = getLevelInfo(profile.totalXP)
  const xpToNext = nextLevel ? nextLevel.minXP - profile.totalXP : 0

  const practiceDates = practiceSessions.map((s) =>
    new Date(s.createdAt).toISOString().slice(0, 10)
  )

  // Serialize for client components
  const recentSessions = practiceSessions.map((s) => ({
    day: s.day,
    duration: s.duration,
    createdAt: new Date(s.createdAt).toISOString(),
  }))

  const progressForCalendar = progress.map((p) => ({
    day: p.day,
    completed: p.completed,
    completedAt: p.completedAt ? new Date(p.completedAt).toISOString() : null,
  }))

  const nextReviews = progress
    .filter((p) => p.nextReviewAt && !p.completed)
    .map((p) => ({ day: p.day, nextReviewAt: new Date(p.nextReviewAt!).toISOString() }))
    .sort((a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime())
    .slice(0, 3)

  // avg practices per week over last 28 days
  const cutoff28 = new Date()
  cutoff28.setDate(cutoff28.getDate() - 28)
  const sessionsLast28 = practiceSessions.filter(
    (s) => new Date(s.createdAt) >= cutoff28
  ).length
  const avgPracticesPerWeek = Math.round((sessionsLast28 / 4) * 10) / 10

  // Greeting based on server time
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = session.user.name?.split(' ')[0] ?? 'there'

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const dailyQuote = GUITARIST_QUOTES[new Date().getDay() % GUITARIST_QUOTES.length]

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <style>{`
        @keyframes flame { 0%,100% { transform: scaleY(1) rotate(-1deg); filter: brightness(1); } 25% { transform: scaleY(1.05) rotate(1deg); filter: brightness(1.15); } 75% { transform: scaleY(1.03) rotate(0.5deg); filter: brightness(1.1); } }
        .flame-anim { animation: flame 1.5s ease-in-out infinite; display: inline-block; transform-origin: bottom center; }
        @keyframes pop-in { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: pop-in 0.4s ease forwards; }
        .quick-action-card:hover { border-color: #f59e0b !important; }
        .quick-action-card:hover .qa-label { color: #f59e0b !important; }
      `}</style>

      <Navbar />

      <LevelUpTrigger totalXP={profile.totalXP} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 900, lineHeight: 1.1 }}>
            {greeting}, {firstName}!
          </h1>
          <p style={{ color: '#737373', fontSize: '0.875rem', marginTop: '0.25rem' }}>{todayDate}</p>
        </div>

        {/* Streak at risk warning */}
        {streakAtRisk && (
          <div style={{ background: 'linear-gradient(135deg, #1a0a00, #0f0600)', border: '1px solid #d97706', borderRadius: 12, padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div>
              <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.875rem' }}>Streak at risk!</p>
              <p style={{ color: '#92400e', fontSize: '0.8rem' }}>Practice today to keep your {streak}-day streak alive.</p>
            </div>
            <a href={`/lesson/${currentDay}`} style={{ marginLeft: 'auto', backgroundColor: '#f59e0b', color: '#000', padding: '6px 16px', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none' }}>Practice Now</a>
          </div>
        )}

        {/* Reviews due pill */}
        {reviewsDue > 0 && (
          <div style={{ marginBottom: 16 }}>
            <a href="/lessons?filter=review" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: '#1a1200', border: '1px solid #d97706', borderRadius: 20, padding: '6px 14px', textDecoration: 'none', animation: 'pulse 2s infinite' }}>
              <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>🔄 {reviewsDue} lesson{reviewsDue > 1 ? 's' : ''} due for review</span>
            </a>
          </div>
        )}

        {/* Today's Mission */}
        <TodaysMission
          currentDay={currentDay}
          lessonTitle={currentLesson.title}
          lessonSubtitle={currentLesson.subtitle}
          duration={currentLesson.duration}
          isCompleted={isCompleted}
        />

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
          className="sm:grid-cols-4 grid-cols-2"
        >
          {/* Current Day */}
          <div
            style={{ backgroundColor: '#111111', border: '1px solid #262626', borderRadius: '0.75rem', padding: '1.25rem' }}
          >
            <DashboardCountUp value={currentDay} label="Current Day" suffix={` / 30`} color="#ffffff" />
            <div style={{ backgroundColor: '#1a1a1a', height: 4, borderRadius: 9999, overflow: 'hidden', marginTop: '0.75rem' }}>
              <div
                style={{
                  background: 'linear-gradient(90deg, #f59e0b, #fde68a)',
                  width: `${completionPct}%`,
                  height: '100%',
                  borderRadius: 9999,
                  transition: 'width 1s ease',
                }}
              />
            </div>
            <p style={{ color: '#525252', fontSize: '0.7rem', marginTop: '0.25rem' }}>{completionPct}% done</p>
          </div>

          {/* Total XP */}
          <div
            style={{ backgroundColor: '#111111', border: '1px solid #262626', borderRadius: '0.75rem', padding: '1.25rem' }}
          >
            <DashboardCountUp value={profile.totalXP} label="Total XP" color="#f59e0b" />
            <div style={{ marginTop: '0.5rem' }}>
              <LevelBadge xp={profile.totalXP} animate />
            </div>
          </div>

          {/* Streak */}
          <div
            style={{ backgroundColor: '#111111', border: '1px solid #262626', borderRadius: '0.75rem', padding: '1.25rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <StreakFlame streak={profile.streak} size={40} />
              <div>
                <p style={{ color: '#a3a3a3', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Day Streak
                </p>
                <p style={{ color: '#525252', fontSize: '0.7rem', marginTop: '0.25rem' }}>Best: {profile.bestStreak}d</p>
              </div>
            </div>
          </div>

          {/* Days completed */}
          <div
            style={{ backgroundColor: '#111111', border: '1px solid #262626', borderRadius: '0.75rem', padding: '1.25rem' }}
          >
            <DashboardCountUp value={completedDays.size} label="Days Completed" color="#ffffff" />
            <p style={{ color: '#525252', fontSize: '0.7rem', marginTop: '0.5rem' }}>of 30</p>
          </div>
        </div>

        {/* XP Ring + Calendar row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
          className="lg:grid-cols-2 grid-cols-1"
        >
          {/* XP Ring */}
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <XPRing xp={profile.totalXP} size={140} />
            <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem' }}>{levelInfo.title}</p>
            {nextLevel ? (
              <p style={{ color: '#525252', fontSize: '0.75rem' }}>
                Next level: <span style={{ color: '#a3a3a3' }}>{xpToNext.toLocaleString()} XP away</span>
              </p>
            ) : (
              <p style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700 }}>Max Level Reached!</p>
            )}
          </div>

          {/* Practice Calendar */}
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderRadius: '0.75rem',
              padding: '1.5rem',
            }}
          >
            <p style={{ color: '#a3a3a3', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Practice Activity
            </p>
            <PracticeCalendar practiceDates={practiceDates} />
          </div>
        </div>

        {/* Practice Trends */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #262626',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <p style={{ color: '#a3a3a3', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            Practice Minutes — Last 14 Days
          </p>
          <PracticeChart sessions={recentSessions} />
        </div>

        {/* Activity + Estimate row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }} className="lg:grid-cols-2 grid-cols-1">
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderRadius: '0.75rem',
              padding: '1.5rem',
            }}
          >
            <p style={{ color: '#a3a3a3', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Activity
            </p>
            <StreakCalendar progress={progressForCalendar} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <CompletionEstimate currentDay={profile.currentDay} avgPracticesPerWeek={avgPracticesPerWeek} />
            <ReviewReminders nextReviews={nextReviews} />
          </div>
        </div>

        {/* Milestone Prompt */}
        <MilestonePrompt completedDays={completedDays.size} streak={profile.streak} />

        {/* Quick Actions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
          className="sm:grid-cols-4 grid-cols-2"
        >
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="quick-action-card"
              style={{
                backgroundColor: '#111111',
                border: '1px solid #262626',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.5rem',
                textDecoration: 'none',
                transition: 'border-color 0.15s ease',
              }}
            >
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{action.icon}</span>
              <span
                className="qa-label"
                style={{
                  color: '#d4d4d4',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  transition: 'color 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                {action.label} →
              </span>
            </Link>
          ))}
        </div>

        {/* Community section */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #262626',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <h2 style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            Join the Community
          </h2>
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}
            className="sm:grid-cols-3 grid-cols-1"
          >
            {/* Discord */}
            <Link
              href="/discord"
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #262626',
                borderRadius: '0.625rem',
                padding: '1rem',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: '#5865F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '0.875rem',
                    flexShrink: 0,
                  }}
                >
                  D
                </div>
                <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.8rem', margin: 0 }}>
                  Join our Discord server
                </p>
              </div>
              <p style={{ color: '#525252', fontSize: '0.75rem', margin: 0 }}>Connect with 500+ students</p>
            </Link>

            {/* Leaderboard teaser */}
            <Link
              href="/leaderboard"
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #262626',
                borderRadius: '0.625rem',
                padding: '1rem',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🏆</span>
                <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.8rem', margin: 0 }}>
                  See how you rank →
                </p>
              </div>
              <p style={{ color: '#525252', fontSize: '0.75rem', margin: 0 }}>Top students by XP &amp; streak</p>
            </Link>

            {/* Referral card */}
            <Link
              href="/referral"
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #262626',
                borderRadius: '0.625rem',
                padding: '1rem',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🎁</span>
                <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.8rem', margin: 0 }}>
                  Earn rewards by referring friends →
                </p>
              </div>
              <p style={{ color: '#525252', fontSize: '0.75rem', margin: 0 }}>Share your unique referral link</p>
            </Link>
          </div>
        </div>

        {/* Daily motivational quote */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #1f1f1f',
            borderLeft: '3px solid #f59e0b',
            borderRadius: '0.75rem',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <blockquote style={{ margin: 0 }}>
            <p style={{ color: '#ffffff', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '0.5rem' }}>
              &ldquo;{dailyQuote.quote}&rdquo;
            </p>
            <footer style={{ color: '#737373', fontSize: '0.75rem' }}>— {dailyQuote.author}</footer>
          </blockquote>
        </div>

        {/* Existing widgets: 2-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }} className="lg:grid-cols-2 grid-cols-1">
          <div id="weekly-plan">
            <WeeklyPlanCard />
          </div>
          <ReviewQueue />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }} className="lg:grid-cols-2 grid-cols-1">
          <AdaptivePath />
          <PartnerWidget />
        </div>

        {/* Footer area */}
        <div style={{ textAlign: 'center', paddingTop: '0.5rem', paddingBottom: '1rem' }}>
          <a href="/api/progress/export" download style={{ color: '#525252', fontSize: '0.75rem' }}>Export progress data →</a>
        </div>

      </main>

      <Footer />
    </div>
  )
}
