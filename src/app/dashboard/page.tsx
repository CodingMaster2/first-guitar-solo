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
]

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.purchaseStatus !== 'PAID') redirect('/success?new=true')

  const [profile, progress, practiceSessions] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.progress.findMany({ where: { userId: session.user.id, completed: true }, orderBy: { day: 'asc' } }),
    prisma.practiceSession.findMany({
      where: { userId: session.user.id },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  if (!profile) redirect('/onboarding')

  const currentDay = profile.currentDay
  const completedDays = new Set(progress.map((p) => p.day))
  const completionPct = Math.round((completedDays.size / 30) * 100)
  const currentLesson = LESSONS.find((l) => l.day === currentDay) ?? LESSONS[0]
  const isCompleted = completedDays.has(currentDay)

  const { current: levelInfo, nextLevel } = getLevelInfo(profile.totalXP)
  const xpToNext = nextLevel ? nextLevel.minXP - profile.totalXP : 0

  const practiceDates = practiceSessions.map((s) =>
    new Date(s.createdAt).toISOString().slice(0, 10)
  )

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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 900, lineHeight: 1.1 }}>
            {greeting}, {firstName}!
          </h1>
          <p style={{ color: '#737373', fontSize: '0.875rem', marginTop: '0.25rem' }}>{todayDate}</p>
        </div>

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
            <div>
              <p style={{ color: '#f59e0b', fontSize: '1.75rem', fontWeight: 900, lineHeight: 1 }}>
                <span className="flame-anim" style={{ display: 'inline-block', marginRight: '0.25rem' }}>🔥</span>
                {profile.streak}
              </p>
              <p style={{ color: '#a3a3a3', fontSize: '0.75rem', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Day Streak
              </p>
            </div>
            <p style={{ color: '#525252', fontSize: '0.7rem', marginTop: '0.5rem' }}>Best: {profile.bestStreak}d</p>
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

      </main>

      <Footer />
    </div>
  )
}
